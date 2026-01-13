import { Injectable } from '@nestjs/common';

import { Nonogram } from './entity/nonogram.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogramModel: typeof Nonogram
  ) {}

  createNonogram(createNonogramDto) {
    return this.nonogramModel.create(createNonogramDto);
  }
}
