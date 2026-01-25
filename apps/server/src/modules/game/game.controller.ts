import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
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

  @Get('all-games/:id')
  getAllUsersGames(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.gameService.getAllUsersGames(currentUser, userId);
  }

  @Get('in-progress/:id')
  getInProgresGames(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.gameService.getInProgresGames(currentUser, userId);
  }

  @Get('finished/:id')
  getFinishedGames(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.gameService.getFinishedGames(currentUser, userId);
  }

  @Get(':id')
  getGameById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.gameService.getGameById(id);
  }
}
