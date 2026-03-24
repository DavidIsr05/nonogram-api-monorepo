import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  CurrentUser,
  CheckAndUpdateInProgressNonogramDto,
  CreateGameDto,
  UpdateGameDto,
} from '../../common';
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

  @Get('all/:id')
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
  getGameById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) gameId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.gameService.getGameWithClues(currentUser, gameId);
  }

  @Patch()
  updateGame(
    @Body(new ZodValidationPipe(UpdateGameDto)) updateGameDto: UpdateGameDto,
    @CurrentUser() currentUser: User
  ) {
    return this.gameService.updateGame(currentUser, updateGameDto);
  }

  @Delete(':id')
  deleteGame(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) gameId: string
  ) {
    return this.gameService.deleteGame(currentUser, gameId);
  }

  @Post('check-nonogram')
  checkAndUpdateInProgressNonogram(
    @Body(new ZodValidationPipe(CheckAndUpdateInProgressNonogramDto))
    checkAndUpdateNonogramTileDto: CheckAndUpdateInProgressNonogramDto,
    @CurrentUser() currentUser: User
  ) {
    return this.gameService.checkAndUpdateInProgressNonogram(
      currentUser,
      checkAndUpdateNonogramTileDto
    );
  }

  @Get('leaders/:nonogramId')
  getNonogramLeaders(
    @Param('nonogramId', new ParseUUIDPipe({ version: '4' })) nonogramId: string
  ) {
    return this.gameService.getNonogramLeaders(nonogramId);
  }
}
