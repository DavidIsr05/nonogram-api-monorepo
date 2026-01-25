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
  NonogramResponseSchema,
  TileStatesEnumValues,
  generateNonogramDto,
} from '@nonogram-api-monorepo/types';
import { Game } from '../game/entity/game.entity';
import { User } from '../user/entity/user.entity';
import { Op } from 'sequelize';
import { ForbiddenNonogramException } from '../../common';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogramModel: typeof Nonogram,
    private readonly httpService: HttpService
  ) {}

  private readonly logger = new Logger(NonogramService.name);

  async createNonogram(currentUser, createNonogramDto) {
    if (!createNonogramDto.isPrivate && !currentUser.isAdmin) {
      throw new ForbiddenNonogramException();
    } else if (currentUser.id !== createNonogramDto.creatorId) {
      throw new ForbiddenNonogramException();
    }

    createNonogramDto = {
      ...createNonogramDto,
      creatorId: currentUser.id,
    };

    try {
      this.logger.log('Creating new nonogram', { createNonogramDto });
      return await this.nonogramModel.create(createNonogramDto);
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
      return firstValueFrom(response);
    } catch (error) {
      throw new BadRequestException('Could not generate nonogram', error.stack);
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

  async getNonogramLeaders(nonogramLeadersRequestDto) {
    try {
      this.logger.log('Getting leaders for nonogram with ID', {
        nonogramLeadersRequestDto,
      });
      return await this.nonogramModel.findAll({
        include: [
          {
            model: Game,
            where: {
              isFinished: true,
            },
            attributes: ['timer'],
            order: ['timer', 'ASC'],
            include: [
              {
                model: User,
                attributes: ['username'],
              },
            ],
          },
        ],
        where: { id: nonogramLeadersRequestDto.nonogramId },
        limit: 10,
        attributes: ['id'],
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
      const foundNonogram = await this.nonogramModel.findOne({
        where: { id },
      });

      if (foundNonogram.creatorId !== currentUser.id) {
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
      throw new BadRequestException('Could not get unplayed nonograms');
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
      throw new BadRequestException('Could not get played nonograms');
    }
  }
}
