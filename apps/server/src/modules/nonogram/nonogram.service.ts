import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Nonogram } from './entity/nonogram.entity';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import {
  CreateNonogramDto,
  CreateNonogramRequestDto,
  GeneratedNonogramResponseDto,
  NonogramResponseSchema,
  TileStatesEnumValues,
  generateNonogramDto,
} from '@nonogram-api-monorepo/types';
import { Game } from '../game/entity/game.entity';
import { User } from '../user/entity/user.entity';
import { Op } from 'sequelize';
import { ForbiddenNonogramException } from '../../common';
import { EncryptionService } from '@hedger/nestjs-encryption';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogramModel: typeof Nonogram,
    private readonly httpService: HttpService,
    private readonly crypto: EncryptionService
  ) {}

  private readonly logger = new Logger(NonogramService.name);

  async createNonogram(
    currentUser: User,
    createNonogramRequestDto: CreateNonogramRequestDto
  ) {
    if (!createNonogramRequestDto.isPrivate && !currentUser.isAdmin) {
      throw new ForbiddenException('Can not create public nonograms');
    } else if (currentUser.id !== createNonogramRequestDto.creatorId) {
      throw new ForbiddenNonogramException();
    }

    const decrypted = this.crypto.decrypt(createNonogramRequestDto.nonogram);

    const nonogramMatrix: boolean[][] = JSON.parse(decrypted);

    const createNonogramDto: CreateNonogramDto = {
      ...createNonogramRequestDto,
      nonogram: nonogramMatrix,
    };

    try {
      this.logger.log('Creating new nonogram');
      return await this.nonogramModel.create(createNonogramDto); //TODO need to parse this return statement to not inclide nonogram like in user
    } catch (error) {
      throw new BadRequestException(
        'Could not create your nonogram',
        error.stack
      );
    }
  }

  async generateNonogram(generateNonogramDto: generateNonogramDto) {
    const response = await this.generateNonogramResponse(generateNonogramDto);

    try {
      this.logger.log('Generating nonogram', { generateNonogramDto });
      const generatedNonogram: GeneratedNonogramResponseDto =
        await firstValueFrom(response);

      const nonogramToEncrypt = JSON.stringify(generatedNonogram.nonogram);

      const encrypted = this.crypto.encrypt(nonogramToEncrypt);

      return {
        ...generatedNonogram,
        nonogram: encrypted,
      };
    } catch (error) {
      if (!(error instanceof ServiceUnavailableException)) {
        throw new BadRequestException(
          'Could not generate nonogram',
          error.stack
        );
      }
    }
  }

  async generateNonogramResponse(generateNonogramDto) {
    const url = process.env.URL_TO_ALGORITHM;
    try {
      this.logger.log('Sending nonogram generate request to external API');
      return await this.httpService
        .post(url, generateNonogramDto)
        .pipe(map((response) => response.data));
    } catch (error) {
      throw new ServiceUnavailableException(
        'Could not access nonogram generator API',
        error.stack
      );
    }
  }

  async getNonogramLeaders(nonogramId) {
    try {
      this.logger.log('Getting leaders for nonogram with ID', {
        nonogramId,
      });
      return await this.nonogramModel.findAll({
        include: [
          {
            model: Game,
            where: {
              isFinished: true,
            },
            attributes: ['timer'],
            required: true,
            include: [
              {
                model: User,
                attributes: ['username'],
              },
            ],
          },
        ],
        where: { id: nonogramId },
        limit: 10,
        attributes: ['id'],
        order: [['games', 'timer', 'ASC']],
        raw: true,
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not get nonogram leaders',
        error.stack
      );
    }
  }

  getNonogramSize(nonogram) {
    const DEFAULT_NONOGRAM_SIZE = 20;
    const sizeFactorBasedOnDifficulty = Object.keys(
      TileStatesEnumValues
    ).indexOf(nonogram.difficulty);

    return DEFAULT_NONOGRAM_SIZE + 10 * sizeFactorBasedOnDifficulty;
  }

  async getNonogramById(currentUser, id): Promise<Nonogram | null> {
    try {
      this.logger.log('Getting nonogram by ID', { id });
      const foundNonogram = await this.nonogramModel.findByPk(id);

      if (
        foundNonogram.isPrivate &&
        foundNonogram.creatorId !== currentUser.id
      ) {
        throw new ForbiddenNonogramException();
      }

      return foundNonogram;
    } catch (error) {
      if (!(error instanceof ForbiddenException)) {
        throw new BadRequestException(
          'Could not find nonogram by ID: ' + id,
          error.stack
        );
      }
    }
  }

  parseObjectForReturn(object) {
    this.logger.log('Parsing nonogram object for return');
    return NonogramResponseSchema.parse(object.toJSON());
  }

  async getAllAvaliableNonograms(currentUser, userId) {
    if (userId !== currentUser.id) {
      throw new ForbiddenNonogramException();
    }
    try {
      this.logger.log('Getting all avaliable nonograms for current user');
      return await this.nonogramModel.findAll({
        where: {
          [Op.or]: [{ isPrivate: false }, { creatorId: userId }],
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not find avaliable nonograms',
        error.stack
      );
    }
  }

  async getNonogramsCreatedByUser(currentUser, creatorId) {
    if (creatorId !== currentUser.id) {
      throw new ForbiddenNonogramException();
    }
    try {
      this.logger.log('Getting nonograms created by user');
      return await this.nonogramModel.findAll({
        where: { creatorId },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not get nonograms created by you',
        error.stack
      );
    }
  }

  async getUnplayedNonograms(currentUser, userId) {
    if (userId !== currentUser.id) {
      throw new ForbiddenNonogramException();
    }
    try {
      this.logger.log('Getting unplayed nonograms');
      const playedNonograms = await this.nonogramModel.findAll({
        attributes: ['id'],
        include: {
          model: Game,
          required: true,
          where: { userId },
        },
      });

      const playedNonogramIds = playedNonograms.map((nonogram) => nonogram.id);

      return await this.nonogramModel.findAll({
        where: {
          [Op.or]: [{ isPrivate: false }, { creatorId: userId }],
          id: { [Op.notIn]: playedNonogramIds },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not get unplayed nonograms',
        error.stack
      );
    }
  }

  async getPlayedNonograms(currentUser, userId) {
    if (userId !== currentUser.id) {
      throw new ForbiddenNonogramException();
    }
    try {
      this.logger.log('Getting played nonograms');
      return await this.nonogramModel.findAll({
        where: {
          [Op.or]: [{ isPrivate: false }, { creatorId: userId }],
        },
        include: {
          model: Game,
          required: true,
          where: { userId },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not get played nonograms',
        error.stack
      );
    }
  }

  async deleteNonogram(currentUser, nonogramId) {
    await this.getNonogramById(currentUser, nonogramId);

    try {
      this.logger.log('Deleting nonogram with ID', { nonogramId });
      return await this.nonogramModel.destroy({
        where: { id: nonogramId },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not delete user with ID: ' + nonogramId,
        error.stack
      );
    }
  }
}
