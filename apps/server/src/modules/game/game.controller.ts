import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from '@nonogram-api-monorepo/types';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('create')
  createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }
}
