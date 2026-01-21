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

    return this.nonogramModel.create(createNonogramDto);
  }

  async generateNonogram(
    generateNonogramDto: generateNonogramDto
  ): Promise<generateNonogramDto> {
    const url = process.env.URL_TO_ALGORITHM;

    const response = this.httpService
      .post(url, generateNonogramDto)
      .pipe(map((response) => response.data));

    return await firstValueFrom(response);
  }

  async getNonogramLeaders(id) {
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
    return this.nonogramModel.findOne({
      where: { id },
    });
  }
}
