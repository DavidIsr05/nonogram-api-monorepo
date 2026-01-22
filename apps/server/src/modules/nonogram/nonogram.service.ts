import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Nonogram } from './entity/nonogram.entity';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import {
  TileStatesEnumValues,
  generateNonogramDto,
} from '@nonogram-api-monorepo/types';
import { Game } from '../game/entity/game.entity';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogramModel: typeof Nonogram,
    private readonly httpService: HttpService
  ) {}

  createNonogram(createNonogramDto, creatorId) {
    if (createNonogramDto.userId !== creatorId) {
      throw new UnauthorizedException();
    }

    createNonogramDto = {
      ...createNonogramDto,
      creatorId: creatorId,
    };

    try {
      return this.nonogramModel.create(createNonogramDto);
    } catch (error) {}
  }

  async generateNonogram(
    generateNonogramDto: generateNonogramDto
  ): Promise<generateNonogramDto> {
    const url = process.env.URL_TO_ALGORITHM;

    const response = this.httpService
      .post(url, generateNonogramDto)
      .pipe(map((response) => response.data));

    try {
      return await firstValueFrom(response);
    } catch (error) {}
  }

  async getNonogramLeaders(id) {
    try {
      return await this.nonogramModel.findAll({
        include: [
          {
            model: Game,
            where: {
              isFinished: true,
            },
            attributes: ['userId', 'timer'],
          },
        ],
        where: { id },
        limit: 10,
        attributes: ['id'],
      });
    } catch (error) {}
  }

  async getNonogramSize(nonogram): Promise<number | null> {
    const defaultNonogramSize = 20;
    const sizeFactorBasedOnDifficulty = Object.keys(
      TileStatesEnumValues
    ).indexOf(nonogram.difficulty);

    const nonogramSize = defaultNonogramSize + 10 * sizeFactorBasedOnDifficulty;

    return nonogramSize;
  }

  async getNonogramById(id): Promise<Nonogram | null> {
    try {
      return await this.nonogramModel.findOne({
        where: { id },
      });
    } catch (error) {
      throw new error();
    }
  }
}
