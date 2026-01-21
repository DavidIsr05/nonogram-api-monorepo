import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from '@nonogram-api-monorepo/types';
import { CurrentUser } from '../../common';
import { User } from '../user/entity/user.entity';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateGameDto))
  createGame(
    @Body() createGameDto: CreateGameDto,
    @CurrentUser() CurrentUser: User
  ) {
    return this.gameService.createGame(createGameDto, CurrentUser.id);
  }
}
