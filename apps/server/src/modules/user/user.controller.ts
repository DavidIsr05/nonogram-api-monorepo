import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '@nonogram-api-monorepo/types';
import { Public, User } from '../../common/decorators';
import { User as UserEntity } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  getUser(@User() user: UserEntity) {
    return this.userService.getUser(user.id);
  }

  @Patch('edit')
  edituser(@Body() updateUserDto: UpdateUserDto, @User() user: UserEntity) {
    return this.userService.updateUser(user.id, updateUserDto);
  }

  @Delete()
  deleteUser(@User() user: UserEntity) {
    return this.userService.deleteUser(user.id);
  }
}
