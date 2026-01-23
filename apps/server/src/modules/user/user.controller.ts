import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '@nonogram-api-monorepo/types';
import { Public, CurrentUser } from '../../common';
import { User } from './entity/user.entity';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUserById(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string
  ) {
    return this.userService.getUserById(currentUser, userId);
  }

  @Public()
  @Post('signup')
  createUser(
    @Body(new ZodValidationPipe(CreateUserDto)) createUserDto: CreateUserDto
  ) {
    return this.userService.createUser(createUserDto);
  }

  @Patch()
  updateUser(
    @Body(new ZodValidationPipe(UpdateUserDto)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User
  ) {
    return this.userService.updateUser(currentUser, updateUserDto);
  }

  @Delete(':id')
  deleteUser(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string
  ) {
    return this.userService.deleteUser(currentUser, userId);
  }
}
