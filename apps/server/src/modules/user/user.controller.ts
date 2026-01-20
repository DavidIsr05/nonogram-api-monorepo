import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '@nonogram-api-monorepo/types';
import { Public } from '../auth';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  getUser(@Request() request) {
    return this.userService.getUser(request.user.id);
  }

  @Patch('edit')
  edituser(@Body() updateUserDto: UpdateUserDto, @Request() request) {
    return this.userService.updateUser(request.user.id, updateUserDto);
  }

  @Delete()
  deleteUser(@Request() request) {
    return this.userService.deleteUser(request.user.id);
  }
}
