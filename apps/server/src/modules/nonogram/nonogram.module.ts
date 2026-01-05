import { Module } from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import { NonogramController } from './nonogram.controller';

@Module({
  providers: [NonogramService],
  controllers: [NonogramController]
})
export class NonogramModule {}
