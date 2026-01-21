import { Body, Controller, Post, UsePipes } from '@nestjs/common';
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
  //TODO maybe make so generate route only returns preview image and create sends request to spring again and saves it then?
  @Post('generate')
  @UsePipes(new ZodValidationPipe(generateNonogramDto))
  generateNonogram(@Body() generateNonogramDto: generateNonogramDto) {
    return this.nonogramService.generateNonogram(generateNonogramDto);
  }

  @Post('nonogram-leaders')
  getNonogramLeaders(@Body() nonogramId: nonogramLeadersRequestDto) {
    return this.nonogramService.getNonogramLeaders(nonogramId);
  }
}
