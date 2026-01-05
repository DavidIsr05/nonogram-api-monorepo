import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Nonogram } from './entity/nonogram.entity';

@Injectable()
export class NonogramService {
  constructor(
    @InjectModel(Nonogram) private readonly nonogram: typeof Nonogram
  ) {}
}
