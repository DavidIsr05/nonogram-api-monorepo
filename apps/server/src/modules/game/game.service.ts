import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entity/game.entity';
import { TileStates, TileStatesEnumType } from '@nonogram-api-monorepo/types';
import { NonogramService } from '../nonogram';
import { ForbiddenGameException } from '../../common';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private readonly gameModel: typeof Game,
    private nonogramModel: NonogramService
  ) {}

  private readonly logger = new Logger(GameService.name);

  async createGame(currentUser, createGameDto) {
    const currentNonogram = await this.nonogramModel.getNonogramById(
      currentUser,
      createGameDto.nonogramId
    );

    const nonogramSize: number = await this.nonogramModel.getNonogramSize(
      currentNonogram
    );

    const blankUncompletedNonogram: TileStatesEnumType[][] = Array.from(
      { length: nonogramSize },
      () => new Array(nonogramSize).fill(TileStates.EMPTY)
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
        where: { isFinished: false },
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
        where: { isFinished: true },
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

  async updateGame(currentUser, updateGameDto) {
    const game = await this.getGameById(currentUser, updateGameDto.id);

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
}
