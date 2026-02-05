import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { NonogramService } from './nonogram.service';
import {
  CreateNonogramRequestDto,
  GenerateNonogramDto,
} from '@nonogram-api-monorepo/types';
import { User } from '../user/entity/user.entity';
import { CurrentUser, Public } from '../../common';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('nonogram')
export class NonogramController {
  constructor(private nonogramService: NonogramService) {}

  @Post('create')
  createNonogram(
    @Body(new ZodValidationPipe(CreateNonogramRequestDto))
    createNonogramRequestDto: CreateNonogramRequestDto,
    @CurrentUser() currentUser: User
  ) {
    return this.nonogramService.createNonogram(
      currentUser,
      createNonogramRequestDto
    );
  }

  @Post('generate')
  generateNonogram(
    @Body(new ZodValidationPipe(GenerateNonogramDto))
    generateNonogramDto: GenerateNonogramDto
  ) {
    return this.nonogramService.generateNonogram(generateNonogramDto);
  }

  @Get('leaders/:nonogramId')
  getNonogramLeaders(
    @Param('nonogramId', new ParseUUIDPipe({ version: '4' })) nonogramId: string
  ) {
    return this.nonogramService.getNonogramLeaders(nonogramId, 10);
  }

  @Public() //TODO remove for "prod"🤓☝️
  @Get('global-leaders')
  getGlobalLeaders() {
    return this.nonogramService.getGlobalLeaders();
  }

  @Get('all/:id')
  getAllAvaliableNonograms(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.nonogramService.getAllAvaliableNonograms(currentUser, userId);
  }

  @Get('createdBy/:id')
  getNonogramsCreatedByUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.nonogramService.getNonogramsCreatedByUser(currentUser, userId);
  }

  @Get('unplayed/:id')
  getUnplayedNonograms(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.nonogramService.getUnplayedNonograms(currentUser, userId);
  }

  @Get('played/:id')
  getPlayedNonograms(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.nonogramService.getPlayedNonograms(currentUser, userId);
  }

  @Get(':id')
  getNonogram(
    @Param('id', new ParseUUIDPipe({ version: '4' })) nonogramId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.nonogramService.getNonogramById(currentUser, nonogramId);
  }

  @Delete(':id')
  deleteUser(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) nonogramId: string
  ) {
    return this.nonogramService.deleteNonogram(currentUser, nonogramId);
  }
}
