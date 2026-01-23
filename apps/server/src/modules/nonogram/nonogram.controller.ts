import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import {
  CreateNonogramDto,
  generateNonogramDto,
  NonogramLeadersRequestDto,
} from '@nonogram-api-monorepo/types';
import { User as UserEntity } from '../user/entity/user.entity';
import { CurrentUser } from '../../common';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('nonogram')
export class NonogramController {
  constructor(private nonogramService: NonogramService) {}

  @Post('create')
  createNonogram(
    @Body(new ZodValidationPipe(CreateNonogramDto))
    createNonogramDto: CreateNonogramDto,
    @CurrentUser() CurrentUser: UserEntity
  ) {
    return this.nonogramService.createNonogram(CurrentUser, createNonogramDto);
  }
  //TODO when genearting return everything encrypted other then preview and then on create we get the object back from cleint decrypt everything and save it
  @Post('generate')
  generateNonogram(
    @Body(new ZodValidationPipe(generateNonogramDto))
    generateNonogramDto: generateNonogramDto
  ) {
    return this.nonogramService.generateNonogram(generateNonogramDto);
  }

  @Post('nonogram-leaders')
  getNonogramLeaders(
    @Body(new ZodValidationPipe(NonogramLeadersRequestDto))
    nonogramLeadersRequestDto: NonogramLeadersRequestDto
  ) {
    //maybe pass the id as Param instead o craeting a dto for it?
    return this.nonogramService.getNonogramLeaders(nonogramLeadersRequestDto);
  }

  @Get(':id')
  getNonogram(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.nonogramService.getNonogramById(id);
  }
}
