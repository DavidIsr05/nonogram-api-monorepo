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
  CreateNonogramType,
  CreateNonogramRequestType,
  GeneratedNonogramResponseType,
  NonogramResponseSchema,
  GenerateNonogramType,
  GamesForEachNonogramType,
  NonogramResponseType,
  NonogramDifficulties,
} from '@nonogram-api-monorepo/types';
import { Game } from '../game/entity/game.entity';
import { User } from '../user/entity/user.entity';
import { Op, fn, col } from 'sequelize';
import {
  ForbiddenNonogramException,
  GlobalLeadersException,
  NonogramLeadersException,
} from '../../common';
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

  async generateNonogram(generateNonogramDto: GenerateNonogramType) {
    const response = await this.generateNonogramResponse(generateNonogramDto);

    try {
      const generatedNonogram: GeneratedNonogramResponseType =
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
    createNonogramRequestDto: CreateNonogramRequestType
  ) {
    if (!createNonogramRequestDto.isPrivate && !currentUser.isAdmin) {
      throw new ForbiddenException('Can not create public nonograms');
    } else if (currentUser.id !== createNonogramRequestDto.creatorId) {
      throw new ForbiddenNonogramException();
    }

    const decrypted = this.crypto.decrypt(createNonogramRequestDto.nonogram);

    const nonogramMatrix: boolean[][] = JSON.parse(decrypted);

    const createNonogramDto: CreateNonogramType = {
      ...createNonogramRequestDto,
      nonogram: nonogramMatrix,
    };

    try {
      const createdNonogram = await this.nonogramModel.create(
        createNonogramDto
      );
      this.logger.log('Created nonogram successfully', { createdNonogram });

      return this.parseObjectForReturn(createdNonogram);
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
      NonogramDifficulties
    ).indexOf(nonogram.difficulty);

    return DEFAULT_NONOGRAM_SIZE + 10 * sizeFactorBasedOnDifficulty;
  }

  async getNonogramById(currentUser, id): Promise<NonogramResponseType | null> {
    try {
      const foundNonogram = await this.nonogramModel.findByPk(id);

      if (
        foundNonogram.isPrivate &&
        foundNonogram.creatorId !== currentUser.id
      ) {
        throw new ForbiddenNonogramException();
      }

      this.logger.log('Got nonogram by ID successfully', { foundNonogram });

      return this.parseObjectForReturn(foundNonogram);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenNonogramException();
      }
      throw new BadRequestException(
        'Could not find nonogram by ID: ' + id,
        error.stack
      );
    }
  }

  async getNonogramByIdForGame(currentUser, id): Promise<Nonogram | null> {
    try {
      const foundNonogram = await this.nonogramModel.findByPk(id);

      if (
        foundNonogram.isPrivate &&
        foundNonogram.creatorId !== currentUser.id
      ) {
        throw new ForbiddenNonogramException();
      }

      this.logger.log('Got nonogram by ID for game successfully', {
        foundNonogram,
      });

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

  parseArrayForReturn(nonogramArray) {
    this.logger.log('Parsing nonograms array for return');

    for (const [index, nonogram] of nonogramArray.entries()) {
      nonogramArray[index] = NonogramResponseSchema.parse(nonogram.toJSON());
    }

    return nonogramArray;
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
        attributes: {
          include: [[fn('COUNT', col('likedGames.id')), 'likeCount']],
        },
        include: [
          {
            model: Game,
            as: 'likedGames',
            attributes: [],
            where: { isLiked: true },
            required: false,
          },
        ],
        group: ['Nonogram.id'],
        order: [[fn('COUNT', col('likedGames.id')), 'DESC']],
      });
      this.logger.log('Got all avaliable nonograms', { allAvaliableNonograms });

      return this.parseArrayForReturn(allAvaliableNonograms);
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
        attributes: {
          include: [[fn('COUNT', col('likedGames.id')), 'likeCount']],
        },
        include: [
          {
            model: Game,
            as: 'likedGames',
            attributes: [],
            where: { isLiked: true },
            required: false,
          },
        ],
        group: ['Nonogram.id'],
        order: [[fn('COUNT', col('likedGames.id')), 'DESC']],
      });

      this.logger.log('Got nonograms created by user successfully', {
        nonogramsCreatedByUser,
      });

      return this.parseArrayForReturn(nonogramsCreatedByUser);
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
        where: {
          [Op.or]: [{ isPrivate: false }, { creatorId: userId }],
          '$games.nonogramId$': null,
        },
        attributes: {
          include: [
            [fn('COUNT', fn('DISTINCT', col('likedGames.id'))), 'likeCount'],
            [fn('COUNT', fn('DISTINCT', col('allGames.id'))), 'gameCount'],
          ],
        },
        include: [
          {
            model: Game,
            as: 'games',
            attributes: [],
            where: { userId },
            required: false,
          },
          {
            model: Game,
            as: 'likedGames',
            attributes: [],
            where: { isLiked: true },
            required: false,
          },
          {
            model: Game,
            as: 'allGames',
            attributes: [],
            required: false,
          },
          {
            model: User,
            attributes: ['username'],
          },
        ],
        group: ['Nonogram.id', 'user.id', 'user.username'],
        order: [[fn('COUNT', col('likedGames.id')), 'DESC']],
      });

      this.logger.log('Got unplayed nonograms successfully', {
        unplayedNonograms,
      });

      return this.parseArrayForReturn(unplayedNonograms);
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
          as: 'games',
          required: true,
          where: { userId },
        },
      });
      this.logger.log('Got played nonograms successfully', { playedNonograms });

      return this.parseArrayForReturn(playedNonograms);
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

      return deletedNonogram;
    } catch (error) {
      throw new BadRequestException(
        'Could not delete user with ID: ' + nonogramId,
        error.stack
      );
    }
  }

  async getGlobalLeaders() {
    try {
      const publicNonogramsDoneGames = await this.getPublicNonogramsDoneGames();

      const topTenPercentNonogramGames: GamesForEachNonogramType[] =
        await this.getTopTenPercentNonogramGames(publicNonogramsDoneGames);

      const usersScores: Record<string, number> = {};

      topTenPercentNonogramGames.forEach((nonogramGames) => {
        const chunkSize = Math.ceil(nonogramGames.games.length * 0.1);

        const usersDivisions = chunk(nonogramGames.games, chunkSize);

        usersDivisions.forEach((chunk, index) => {
          chunk.forEach((game) => {
            const { username } = game.user;

            if (usersScores[username]) {
              usersScores[username] = usersScores[username] + 1 * (index + 1);
            } else {
              usersScores[username] = 1 * (index + 1);
            }
          });
        });
      });

      const leaderboard = Object.entries(usersScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .slice(0, 10)
        .map(([username, score]) => ({ username, score }));

      this.logger.log('Got global leaders successfully', { leaderboard });
      return leaderboard;
    } catch (error) {
      throw new GlobalLeadersException(error.stack);
    }
  }

  async getPublicNonogramsDoneGames() {
    try {
      const gamesForEachNonogram: GamesForEachNonogramType[] =
        await this.nonogramModel.findAll({
          attributes: ['id'],
          where: { isPrivate: false },
          group: [
            'Nonogram.id',
            'games.timer',
            'games.mistakes',
            'games.id',
            'games->user.id',
          ],
          order: [
            ['games', 'timer'],
            ['games', 'mistakes'],
          ],
          include: {
            model: Game,
            as: 'games',
            where: { isFinished: true },
            attributes: ['timer', 'mistakes'],
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
      const parsedGamesForEachNonogram: GamesForEachNonogramType[] = JSON.parse(
        stringifiedGamesForEachNonogram
      );

      this.logger.log('Successfully got public nonograms finished games:', {
        parsedGamesForEachNonogram,
      });

      return parsedGamesForEachNonogram;
    } catch (error) {
      throw new BadRequestException(
        'Could not game public nonograms finished games',
        error.stack
      );
    }
  }

  getTopTenPercentNonogramGames(publicNonogramsDoneGames) {
    publicNonogramsDoneGames.forEach((nonogramGames) => {
      const countOfGamesForNonogram = nonogramGames.games.length;
      const numberOfGamesInTopTen = Math.ceil(countOfGamesForNonogram * 0.1);

      nonogramGames.games.splice(
        numberOfGamesInTopTen,
        countOfGamesForNonogram - numberOfGamesInTopTen
      );
    });

    return publicNonogramsDoneGames;
  }
}
