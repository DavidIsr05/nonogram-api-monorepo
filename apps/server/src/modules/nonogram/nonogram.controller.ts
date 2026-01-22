import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import {
  CreateNonogramDto,
  generateNonogramDto,
  nonogramLeadersRequestDto,
} from '@nonogram-api-monorepo/types';
import { User as UserEntity } from '../user/entity/user.entity';
import { CurrentUser } from '../../common';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('nonogram')
export class NonogramController {
  constructor(private nonogramService: NonogramService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(CreateNonogramDto))
  createNonogram(
    @Body() createNonogramDto: CreateNonogramDto,
    @CurrentUser() CurrentUser: UserEntity
  ) {
    return this.nonogramService.createNonogram(
      createNonogramDto,
      CurrentUser.id
    );
  }
  //TODO when genearting return everything encrypted other then preview and then on create we get the object back from cleint decrypt everything and save it
  @Post('generate')
  @UsePipes(new ZodValidationPipe(generateNonogramDto))
  generateNonogram(@Body() generateNonogramDto: generateNonogramDto) {
    return this.nonogramService.generateNonogram(generateNonogramDto);
  }

  @Post('nonogram-leaders')
  getNonogramLeaders(@Body() nonogramId: nonogramLeadersRequestDto) {
    return this.nonogramService.getNonogramLeaders(nonogramId);
  }

  @Get(':id')
  getNonogram(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.nonogramService.getNonogramById(id);
  }
}
