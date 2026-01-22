import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entity/game.entity';
import { TileStates, TileStatesEnumType } from '@nonogram-api-monorepo/types';
import { NonogramService } from '../nonogram';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game) private readonly gameModel: typeof Game,
    private nonogramModel: NonogramService
  ) {}

  async createGame(createGameDto, userId) {
    if (createGameDto.userId !== userId) {
      throw new ForbiddenException('You can not create games for other users');
    } //TODO need to check with what nonogram user is trying to create game as well

    const currentNonogram = await this.nonogramModel.getNonogramById(
      createGameDto.nonogramId
    );

    const nonogramSize: number = await this.nonogramModel.getNonogramSize(
      currentNonogram
    );

    const blankUncompletedNonogram: TileStatesEnumType[][] = Array.from(
      { length: nonogramSize },
      () => new Array(nonogramSize).fill(TileStates.EMPTY)
    );

    createGameDto = {
      ...createGameDto,
      userId: userId,
      uncompletedNonogram: blankUncompletedNonogram,
    };

    try {
      return this.gameModel.create(createGameDto);
    } catch (error) {
      throw new BadRequestException(
        'Could not create game for nonogram: ' + createGameDto.nonogramId
      );
    }
  }
}
