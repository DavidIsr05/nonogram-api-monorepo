import { Body, Controller, Post, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from '@nonogram-api-monorepo/types';
import { User } from '../../common/decorators';
import { User as UserEntity } from '../user/entity/user.entity';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('create')
  createGame(@Body() createGameDto: CreateGameDto, @User() user: UserEntity) {
    return this.gameService.createGame(createGameDto, user.id);
  }
}
