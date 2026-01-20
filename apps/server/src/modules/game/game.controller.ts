import { Body, Controller, Post, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from '@nonogram-api-monorepo/types';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('create')
  createGame(@Body() createGameDto: CreateGameDto, @Request() request) {
    return this.gameService.createGame(createGameDto, request.user.id);
  }
}
