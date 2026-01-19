import { Injectable } from '@nestjs/common';

import { Nonogram } from './entity/nonogram.entity';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { generateNonogramDto } from '@nonogram-api-monorepo/types';
import { Game } from '../game/entity/game.entity';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogramModel: typeof Nonogram,
    private readonly httpService: HttpService
  ) {}

  createNonogram(createNonogramDto, id) {
    createNonogramDto = {
      ...createNonogramDto,
      creatorId: id,
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

    const responseData = await firstValueFrom(response);
    return responseData;
  }

  async getGlobalLeaders() {}

  async getNonogramLeaders() {
    return await this.nonogramModel.findAll({
      include: [
        {
          model: Game,
          where: {
            isFinished: true,
          },
        },
      ],
      limit: 10,
      order: [['timer', 'DESC']],
    });
  }
}
