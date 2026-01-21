import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from '@nonogram-api-monorepo/types';
import { CurrentUser } from '../../common/decorators';
import { User as UserEntity } from '../user/entity/user.entity';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  createGame(
    @Body() createGameDto: CreateGameDto,
    @CurrentUser() CurrentUser: UserEntity
  ) {
    return this.gameService.createGame(createGameDto, CurrentUser.id);
  }
}
