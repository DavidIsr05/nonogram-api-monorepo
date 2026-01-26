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

    if (
      currentNonogram.isPrivate &&
      currentNonogram.creatorId !== currentUser.id
    ) {
      throw new ForbiddenGameException();
    }

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
      this.logger.log('Creating new game', { createGameDto });
      return this.gameModel.create(createGameDto);
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
      this.logger.log('Getting all of the users games');
      return await this.gameModel.findAll({
        where: { userId },
      });
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
      this.logger.log('Getting users in progress games');
      return await this.gameModel.findAll({
        where: { isFinished: false },
      });
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
      this.logger.log('Getting users finished games');
      return await this.gameModel.findAll({
        where: { isFinished: true },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not get finished games',
        error.stack
      );
    }
  }

  async getGameById(currentUser, gameId) {
    try {
      this.logger.log('Getting game by id');
      const foundGame = await this.gameModel.findByPk(gameId);

      if (foundGame.userId !== currentUser.id) {
        throw new ForbiddenGameException();
      }
      return foundGame;
    } catch (error) {
      if (!(error instanceof ForbiddenException)) {
        throw new BadRequestException(
          'Could not get game by ID: ' + gameId,
          error.stack
        );
      }
    }
  }

  async deleteGame(currentUser, gameId) {
    await this.getGameById(currentUser, gameId);

    try {
      this.logger.log('Deleting nonogram with ID', { gameId });
      return await this.gameModel.destroy({
        where: { id: gameId },
      });
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
      this.logger.log('Updated game', { game });
      return await game.save();
    } catch (error) {
      throw new BadRequestException(
        'Could not update user with ID: ' + game.id,
        error.stack
      );
    }
  }
}
