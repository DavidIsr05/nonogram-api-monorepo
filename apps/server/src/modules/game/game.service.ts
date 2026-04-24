import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entity/game.entity';
import {
  GameStatus,
  TileStates,
  MISTAKES_THRESHOLD,
} from '@nonogram-api-monorepo/types';
import { NonogramService } from '../nonogram';
import {
  ForbiddenGameException,
  LikingUnfinishedGameException,
  NonogramLeadersException,
} from '../../common';
import { Nonogram } from '../nonogram/entity/nonogram.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private readonly gameModel: typeof Game,
    private nonogramModel: NonogramService
  ) {}

  private readonly logger = new Logger(GameService.name);

  async createGame(currentUser, createGameDto) {
    const blankUncompletedNonogram =
      await this.generateEmptyUncompletedNonogram(
        currentUser,
        createGameDto.nonogramId
      );

    createGameDto = {
      ...createGameDto,
      userId: currentUser.id,
      uncompletedNonogram: blankUncompletedNonogram,
    };

    try {
      const createdGame = this.gameModel.create(createGameDto);
      this.logger.log('Created game successfully', { createdGame });
      return createdGame;
    } catch (error) {
      throw new BadRequestException(
        'Could not create game for nonogram: ' + createGameDto.nonogramId,
        error.stack
      );
    }
  }

  async getAllUsersGames(currentUser, userId) {
    if (userId !== currentUser.id) {
      throw new ForbiddenGameException();
    }
    try {
      const foundAllUsersGames = await this.gameModel.findAll({
        where: { userId },
      });
      this.logger.log('Found users games successfully', { foundAllUsersGames });
      return foundAllUsersGames;
    } catch (error) {
      throw new BadRequestException(
        'Could not get all users games',
        error.stack
      );
    }
  }

  async getInProgresGames(currentUser, userId) {
    if (userId !== currentUser.id) {
      throw new ForbiddenGameException();
    }
    try {
      const inProgresGames = await this.gameModel.findAll({
        where: { isFinished: false, userId },
        include: {
          model: Nonogram,
          attributes: ['difficulty', 'name'],
        },
        attributes: ['id', 'timer', 'mistakes'],
      });
      this.logger.log('Got in progress games successfully', { inProgresGames });
      return inProgresGames;
    } catch (error) {
      throw new BadRequestException(
        'Could not get in progress games',
        error.stack
      );
    }
  }

  async getFinishedGames(currentUser, userId) {
    if (userId !== currentUser.id) {
      throw new ForbiddenGameException();
    }
    try {
      const finishedGames = await this.gameModel.findAll({
        where: { isFinished: true, userId },
        include: {
          model: Nonogram,
          attributes: ['completeNonogramImageBase64', 'name'],
        },
      });
      this.logger.log('Got finished games successfully', { finishedGames });
      return finishedGames;
    } catch (error) {
      throw new BadRequestException(
        'Could not get finished games',
        error.stack
      );
    }
  }

  async getFinishedGame(currentUser, gameId) {
    try {
      const finishedGame = await this.gameModel.findOne({
        where: { isFinished: true, id: gameId, userId: currentUser.id },
        include: {
          model: Nonogram,
          attributes: ['completeNonogramImageBase64', 'name'],
        },
      });

      if (finishedGame.userId !== currentUser.id) {
        throw new ForbiddenGameException();
      }

      this.logger.log('Got finished games successfully', { finishedGame });
      return finishedGame;
    } catch (error) {
      throw new BadRequestException('Could not get finished game', error.stack);
    }
  }

  async getGameById(currentUser, gameId) {
    try {
      const foundGame = await this.gameModel.findByPk(gameId);

      if (foundGame.userId !== currentUser.id) {
        throw new ForbiddenGameException();
      }
      this.logger.log('Found game by ID successfully', { foundGame });
      return foundGame;
    } catch (error) {
      if (!(error instanceof ForbiddenException)) {
        throw new BadRequestException(
          'Could not get game by ID: ' + gameId,
          error.stack
        );
      }
      throw new ForbiddenGameException();
    }
  }

  async getGameWithClues(currentUser, gameId) {
    const foundGame = await this.getGameById(currentUser, gameId);

    const foundNonogram = await this.nonogramModel.getNonogramByIdForGame(
      currentUser,
      foundGame.nonogramId
    );

    return {
      ...foundGame.toJSON(),
      ...this.returnRowAndColClues(foundNonogram.nonogram),
      nonogramName: foundNonogram.name,
      nonogramDifficulty: foundNonogram.difficulty,
    };
  }

  returnRowAndColClues(nonogram: boolean[][]) {
    const rowClues: number[][] = nonogram.map(this.calculateClues);

    const colClues: number[][] = nonogram[0].map((_, columnIndex) =>
      this.calculateClues(nonogram.map((row) => row[columnIndex]))
    );

    return { rowClues, colClues };
  }

  calculateClues = (nonogramRow) => {
    const clues: number[] = [];
    let count = 0;

    nonogramRow.forEach((tile) => {
      if (tile) {
        count++;
      } else if (count > 0) {
        clues.push(count);
        count = 0;
      }
    });

    if (count > 0) {
      clues.push(count);
    }

    return clues.length ? clues : [0];
  };

  async deleteGame(currentUser, gameId) {
    await this.getGameById(currentUser, gameId);

    try {
      const deletedGame = await this.gameModel.destroy({
        where: { id: gameId },
      });
      this.logger.log('Deleted game successfully', { deletedGame });
    } catch (error) {
      throw new BadRequestException(
        'Could not delete user with ID: ' + gameId,
        error.stack
      );
    }
  }

  async generateEmptyUncompletedNonogram(
    currentUser,
    nonogramId
  ): Promise<TileStates[][]> {
    const currentNonogram = await this.nonogramModel.getNonogramById(
      currentUser,
      nonogramId
    );

    const nonogramSize: number = await this.nonogramModel.getNonogramSize(
      currentNonogram
    );

    return Array.from({ length: nonogramSize }, () =>
      new Array(nonogramSize).fill(TileStates.EMPTY)
    );
  }

  async updateGame(currentUser, updateGameDto) {
    const game = await this.getGameById(currentUser, updateGameDto.id);

    if (updateGameDto.isLiked && !game.isFinished) {
      throw new LikingUnfinishedGameException();
    }

    game.set({
      ...updateGameDto,
    });

    try {
      const updatedGame = await game.save();
      this.logger.log('Updated game successfully', { updatedGame });
      return updatedGame;
    } catch (error) {
      throw new BadRequestException(
        'Could not update user with ID: ' + game.id,
        error.stack
      );
    }
  }

  async checkAndUpdateInProgressNonogram(
    currentUser,
    checkAndUpdateInProgressNonogramDto
  ) {
    const foundGame = await this.getGameById(
      currentUser,
      checkAndUpdateInProgressNonogramDto.gameId
    );

    const foundNonogram = await this.nonogramModel.getNonogramByIdForGame(
      currentUser,
      foundGame.nonogramId
    );

    const { uncompletedNonogram } = foundGame;

    let { mistakes } = foundGame;

    checkAndUpdateInProgressNonogramDto.inProgressNonogramCoordinates.forEach(
      ({ rowIndex, colIndex }) => {
        if (foundNonogram.nonogram[rowIndex][colIndex]) {
          uncompletedNonogram[rowIndex][colIndex] = TileStates.FILLED;
        } else {
          uncompletedNonogram[rowIndex][colIndex] = TileStates.MISTAKE;

          mistakes++;
        }
      }
    );

    const isWon = foundNonogram.nonogram.every((row, rowIndex) =>
      row.every(
        (tile, colIndex) =>
          !tile || uncompletedNonogram[rowIndex][colIndex] === TileStates.FILLED
      )
    );

    this.updateGame(currentUser, {
      id: foundGame.id,
      uncompletedNonogram: uncompletedNonogram,
      timer: checkAndUpdateInProgressNonogramDto.timer,
      mistakes: mistakes,
      isFinished: isWon && mistakes < MISTAKES_THRESHOLD,
    });

    return {
      board: uncompletedNonogram,
      status:
        mistakes >= MISTAKES_THRESHOLD
          ? GameStatus.LOST
          : isWon
          ? GameStatus.WON
          : GameStatus.FINE,
    };
  }

  async getNonogramLeaders(nonogramId) {
    try {
      const nonogramLeaders = await Game.findAll({
        where: { nonogramId, isFinished: true },
        attributes: ['timer'],
        include: [
          {
            model: User,
            attributes: ['username'],
          },
        ],
        limit: 10,
        order: [['timer', 'ASC']],
      });

      this.logger.log('Got nonogram leaders successfully', {
        nonogramLeaders,
      });
      return nonogramLeaders;
    } catch (error) {
      throw new NonogramLeadersException(error.stack);
    }
  }
}
