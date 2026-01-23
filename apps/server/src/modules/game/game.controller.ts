import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from '@nonogram-api-monorepo/types';
import { CurrentUser } from '../../common';
import { User } from '../user/entity/user.entity';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  createGame(
    @Body(new ZodValidationPipe(CreateGameDto)) createGameDto: CreateGameDto,
    @CurrentUser() CurrentUser: User
  ) {
    return this.gameService.createGame(CurrentUser, createGameDto);
  }
}
