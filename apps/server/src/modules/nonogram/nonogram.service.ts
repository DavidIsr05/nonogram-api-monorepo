import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Nonogram } from './entity/nonogram.entity';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import {
  NonogramResponseSchema,
  TileStatesEnumValues,
  generateNonogramDto,
} from '@nonogram-api-monorepo/types';
import { Game } from '../game/entity/game.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogramModel: typeof Nonogram,
    private readonly httpService: HttpService
  ) {}

  private readonly logger = new Logger(NonogramService.name);

  async createNonogram(currentUser, createNonogramDto) {
    if (!createNonogramDto.isPrivate && !currentUser.isAdmin) {
      throw new ForbiddenException('You can not create public nonograms');
    } else if (currentUser.id !== createNonogramDto.creatorId) {
      throw new ForbiddenException('Can not create nonograms or other users');
    }

    createNonogramDto = {
      ...createNonogramDto,
      creatorId: currentUser.id,
    };

    try {
      this.logger.log('Creating new nonogram', { createNonogramDto });
      return await this.nonogramModel.create(createNonogramDto);
    } catch (error) {
      throw new BadRequestException(
        'Could not create your nonogram',
        error.stack
      );
    }
  }

  async generateNonogram(generateNonogramDto: generateNonogramDto) {
    const response = await this.generateNonogramResponse(generateNonogramDto);

    try {
      this.logger.log('Generating nonogram', { generateNonogramDto });
      return firstValueFrom(response);
    } catch (error) {
      throw new BadRequestException('Could not generate nonogram', error.stack);
    }
  }

  async generateNonogramResponse(generateNonogramDto) {
    const url = process.env.URL_TO_ALGORITHM;
    try {
      this.logger.log('Sending nonogram generate request to external API');
      return await this.httpService
        .post(url, generateNonogramDto)
        .pipe(map((response) => response.data));
    } catch (error) {
      throw new ServiceUnavailableException(
        'Could not access nonogram generator API',
        error.stack
      );
    }
  }

  async getNonogramLeaders(nonogramLeadersRequestDto) {
    try {
      this.logger.log('Getting leaders for nonogram with ID', {
        nonogramLeadersRequestDto,
      });
      return await this.nonogramModel.findAll({
        include: [
          {
            model: Game,
            where: {
              isFinished: true,
            },
            attributes: ['timer'],
            order: ['timer', 'ASC'],
            include: [
              {
                model: User,
                attributes: ['username'],
              },
            ],
          },
        ],
        where: { id: nonogramLeadersRequestDto.nonogramId },
        limit: 10,
        attributes: ['id'],
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not get nonogram leaders',
        error.stack
      );
    }
  }

  getNonogramSize(nonogram) {
    const DEFAULT_NONOGRAM_SIZE = 20;
    const sizeFactorBasedOnDifficulty = Object.keys(
      TileStatesEnumValues
    ).indexOf(nonogram.difficulty);

    return DEFAULT_NONOGRAM_SIZE + 10 * sizeFactorBasedOnDifficulty;
  }

  async getNonogramById(id): Promise<Nonogram | null> {
    try {
      this.logger.log('Getting nonogram by ID', { id });
      return await this.nonogramModel.findOne({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not find nonogram by ID: ' + id,
        error.stack
      );
    }
  }

  parseObjectForReturn(object) {
    this.logger.log('Parsing nonogram object for return');
    return NonogramResponseSchema.parse(object.toJSON());
  }
}
