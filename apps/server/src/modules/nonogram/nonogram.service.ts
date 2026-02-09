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
  GenerateNonogramDto,
  gamesForEachNonogramDto,
} from '@nonogram-api-monorepo/types';
import { Game } from '../game/entity/game.entity';
import { User } from '../user/entity/user.entity';
import { Op } from 'sequelize';
import { ForbiddenNonogramException } from '../../common';
import { EncryptionService } from '@hedger/nestjs-encryption';
import { chunk } from 'lodash';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogramModel: typeof Nonogram,
    private readonly httpService: HttpService,
    private readonly crypto: EncryptionService
  ) {}

  private readonly logger = new Logger(NonogramService.name);

  async generateNonogram(generateNonogramDto: GenerateNonogramDto) {
    const response = await this.generateNonogramResponse(generateNonogramDto);

    try {
      const generatedNonogram: GeneratedNonogramResponseDto =
        await firstValueFrom(response);

      const nonogramToEncrypt = JSON.stringify(generatedNonogram.nonogram);

      const encrypted = this.crypto.encrypt(nonogramToEncrypt);

      this.logger.log('Generated nonogram successfully', {
        generateNonogramDto,
      });

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
      throw new ServiceUnavailableException(error.stack);
    }
  }

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
      const createdNonogram = await this.nonogramModel.create(
        createNonogramDto
      ); //TODO need to parse this return statement to not inclide nonogram like in user
      this.logger.log('Created nonogram successfully', { createdNonogram });
      return createdNonogram;
    } catch (error) {
      throw new BadRequestException(
        'Could not create your nonogram',
        error.stack
      );
    }
  }

  async generateNonogramResponse(generateNonogramDto) {
    const url = process.env.URL_TO_ALGORITHM;
    try {
      this.logger.log('Sending nonogram generate request to external API');
      const responseFromApi = await this.httpService
        .post(url, generateNonogramDto)
        .pipe(map((response) => response.data));
      this.logger.log('Recieved response from external API successfully', {
        responseFromApi,
      });
      return responseFromApi;
    } catch (error) {
      throw new ServiceUnavailableException(
        'Could not access nonogram generator API',
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
      const foundNonogram = await this.nonogramModel.findByPk(id);

      if (
        foundNonogram.isPrivate &&
        foundNonogram.creatorId !== currentUser.id
      ) {
        throw new ForbiddenNonogramException();
      }
      this.logger.log('Got nonogram by ID successfully', { foundNonogram });
      return foundNonogram;
    } catch (error) {
      if (!(error instanceof ForbiddenException)) {
        throw new BadRequestException(
          'Could not find nonogram by ID: ' + id,
          error.stack
        );
      }
      throw new ForbiddenNonogramException();
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
      const allAvaliableNonograms = await this.nonogramModel.findAll({
        where: {
          [Op.or]: [{ isPrivate: false }, { creatorId: userId }],
        },
      });
      this.logger.log('Got all avaliable nonograms', { allAvaliableNonograms });
      return allAvaliableNonograms;
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
      const nonogramsCreatedByUser = await this.nonogramModel.findAll({
        where: { creatorId },
      });
      this.logger.log('Got nonograms created by user successfully', {
        nonogramsCreatedByUser,
      });
      return nonogramsCreatedByUser;
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
      const unplayedNonograms = await this.nonogramModel.findAll({
        include: {
          model: Game,
          where: { userId },
          attributes: ['nonogramId'],
          required: false,
        },
        attributes: ['id'],
        raw: true,
        where: {
          [Op.or]: { isPrivate: false, creatorId: userId },
          '$games.nonogramId$': { [Op.is]: null },
        },
      });

      this.logger.log('Got unplayed nonograms successfully', {
        unplayedNonograms,
      });
      return unplayedNonograms;
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
      const playedNonograms = await this.nonogramModel.findAll({
        where: {
          [Op.or]: [{ isPrivate: false }, { creatorId: userId }],
        },
        include: {
          model: Game,
          required: true,
          where: { userId },
        },
      });
      this.logger.log('Got played nonograms successfully', { playedNonograms });
      return playedNonograms;
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
      const deletedNonogram = await this.nonogramModel.destroy({
        where: { id: nonogramId },
      });
      this.logger.log('Deleted nonogram with ID successfully', {
        deletedNonogram,
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not delete user with ID: ' + nonogramId,
        error.stack
      );
    }
  }

  async getNonogramLeaders(nonogramId, limit) {
    try {
      const nonogramLeaders = await this.nonogramModel.findAll({
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
        limit: limit,
        attributes: ['id'],
        order: [['games', 'timer', 'ASC']],
      });
      this.logger.log('Got nonogram leaders successfully', {
        nonogramLeaders,
      });
      return nonogramLeaders;
    } catch (error) {
      throw new BadRequestException(
        'Could not get nonogram leaders',
        error.stack
      );
    }
  }

  async getGlobalLeaders() {
    try {
      const gamesForEachNonogram: gamesForEachNonogramDto[] =
        await this.nonogramModel.findAll({
          attributes: ['id'],
          where: { isPrivate: false },
          group: [
            'Nonogram.id',
            'games.timer',
            'games.mistakes',
            'games.hints',
            'games.id',
            'games->user.id',
          ],
          order: [
            ['games', 'timer'],
            ['games', 'mistakes'],
            ['games', 'hints'],
          ],
          include: {
            model: Game,
            where: { isFinished: true },
            attributes: ['timer', 'mistakes', 'hints'],
            include: [
              {
                model: User,
                attributes: ['username'],
              },
            ],
          },
        });

      const stringifiedGamesForEachNonogram =
        JSON.stringify(gamesForEachNonogram);
      const parsedGamesForEachNonogram: gamesForEachNonogramDto[] = JSON.parse(
        stringifiedGamesForEachNonogram
      );

      for (const item of parsedGamesForEachNonogram) {
        const countOfGamesForNonogram = item.games.length;
        const numberOfGamesInTopTen = Math.ceil(countOfGamesForNonogram * 0.1);

        item.games.splice(
          numberOfGamesInTopTen,
          countOfGamesForNonogram - numberOfGamesInTopTen
        );
      }

      const usersScoresMap = new Map<string, number>();

      for (const nonogramObject of parsedGamesForEachNonogram) {
        const chunkSize = Math.ceil(nonogramObject.games.length * 0.1);

        const chunkedArray = chunk(nonogramObject.games, chunkSize);

        for (const [index, chunk] of chunkedArray.entries()) {
          for (const game of chunk) {
            const currentUsername = game.user.username;

            if (usersScoresMap.has(currentUsername)) {
              usersScoresMap.set(
                currentUsername,
                usersScoresMap.get(currentUsername) + 1 * (index + 1)
              );
            } else {
              usersScoresMap.set(currentUsername, 1 * (index + 1));
            }
          }
        }
      }

      const sortedMap = new Map(
        [...usersScoresMap.entries()].sort((a, b) => b[1] - a[1])
      );

      this.logger.log('Got global leaders successfully', { sortedMap });
      return Array.from(sortedMap.entries());
    } catch (error) {
      throw new BadRequestException(
        'Could not get global leaders',
        error.stack
      );
    }
  }
}
