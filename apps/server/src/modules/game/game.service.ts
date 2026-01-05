import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entity/game.entity';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game) private readonly game: typeof Game) {}
}
