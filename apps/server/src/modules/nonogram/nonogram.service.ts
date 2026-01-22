import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
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
      throw new ForbiddenException(
        'You can not create nonograms for other users'
      );
    } // TODO make sure to check if user is trying to create a public game he must be an admin.
    // get the whole user from controller and not only the id so check can be made easily

    createNonogramDto = {
      ...createNonogramDto,
      creatorId: creatorId,
    };

    try {
      return this.nonogramModel.create(createNonogramDto);
    } catch (error) {
      throw new BadRequestException('Could not create your nonogram', error);
    }
  }

  async generateNonogram(generateNonogramDto: generateNonogramDto) {
    const response = await this.generateNonogramResponse(generateNonogramDto);

    try {
      return await firstValueFrom(response);
    } catch (error) {
      throw new BadRequestException('Could not generate nonogram', error);
    }
  }

  async generateNonogramResponse(generateNonogramDto) {
    const url = process.env.URL_TO_ALGORITHM;
    try {
      return await this.httpService
        .post(url, generateNonogramDto)
        .pipe(map((response) => response.data));
    } catch (error) {
      throw new ServiceUnavailableException(
        'Could not access nonogram generator API',
        error
      );
    }
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
    } catch (error) {
      throw new BadRequestException('Could not get nonogram leaders', error);
    }
  }

  getNonogramSize(nonogram) {
    const defaultNonogramSize = 20;
    const sizeFactorBasedOnDifficulty = Object.keys(
      TileStatesEnumValues
    ).indexOf(nonogram.difficulty);

    const nonogramSize = defaultNonogramSize + 10 * sizeFactorBasedOnDifficulty;
    //TODO maybe get rid of the const and return the equation
    return nonogramSize;
  }

  async getNonogramById(id): Promise<Nonogram | null> {
    try {
      return await this.nonogramModel.findOne({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not find nonogram by ID: ' + id,
        error
      );
    }
  }
}
