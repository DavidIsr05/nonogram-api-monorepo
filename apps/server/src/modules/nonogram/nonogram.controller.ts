import { Body, Controller, Post } from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import { CreateNonogramDto } from '@nonogram-api-monorepo/types';

@Controller('nonogram')
export class NonogramController {
  constructor(private nonogramService: NonogramService) {}

  @Post('create')
  createNonogram(@Body() createNonogramDto: CreateNonogramDto) {
    return this.nonogramService.createNonogram(createNonogramDto);
  }
}
