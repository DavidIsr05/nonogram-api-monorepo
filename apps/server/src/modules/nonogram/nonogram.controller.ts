import { Body, Controller, Post, Request } from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import {
  CreateNonogramDto,
  generateNonogramDto,
} from '@nonogram-api-monorepo/types';

@Controller('nonogram')
export class NonogramController {
  constructor(private nonogramService: NonogramService) {}

  @Post('create')
  createNonogram(@Body() createNonogramDto: CreateNonogramDto, @Request() req) {
    return this.nonogramService.createNonogram(createNonogramDto, req.user.id);
  }

  @Post('generate')
  generateNonogram(@Body() generateNonogramDto: generateNonogramDto) {
    return this.nonogramService.generateNonogram(generateNonogramDto);
  }

  @Post('nonogram-leaders')
  getNonogramLeaders(@Body() id) {
    return this.nonogramService.getNonogramLeaders(id.id);
  }
}
