import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entity/game.entity';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game) private readonly gameModel: typeof Game) {}

  createGame(createGameDto, userId) {
    createGameDto = {
      ...createGameDto,
      userId: userId,
    };

    return this.gameModel.create(createGameDto);
  }
}
