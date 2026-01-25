import { Module } from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import { NonogramController } from './nonogram.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Nonogram } from './entity/nonogram.entity';
import { HttpModule } from '@nestjs/axios';
import { GameModule } from '../game';

@Module({
  providers: [NonogramService],
  controllers: [NonogramController],
  imports: [SequelizeModule.forFeature([Nonogram]), HttpModule],
  exports: [NonogramService],
})
export class NonogramModule {}
