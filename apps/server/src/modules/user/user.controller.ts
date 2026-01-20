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
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(
      createUserDto.personalNumber,
      createUserDto
    );
  }

  @Get()
  getUser(@Request() req) {
    return this.userService.getUser(req.user.id);
  }

  @Patch('edit')
  edituser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  @Delete()
  deleteUser(@Request() req) {
    return this.userService.deleteUser(req.user.id);
  }
}
