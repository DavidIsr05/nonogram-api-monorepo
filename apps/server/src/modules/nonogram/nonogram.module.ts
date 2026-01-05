import { Module } from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import { NonogramController } from './nonogram.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Nonogram } from './entity/nonogram.entity';

@Module({
  providers: [NonogramService],
  controllers: [NonogramController],
  imports: [SequelizeModule.forFeature([Nonogram])],
})
export class NonogramModule {}
