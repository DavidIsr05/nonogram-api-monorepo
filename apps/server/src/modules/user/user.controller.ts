import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '@nonogram-api-monorepo/types';
import { Public, CurrentUser } from '../../common/decorators';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUserById(@CurrentUser() currentUser: User, @Param() paramId: string) {
    return this.userService.getUserById(paramId, currentUser.id);
  }

  @Public()
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch()
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User
  ) {
    return this.userService.updateUser(currentUser.id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@CurrentUser() currentUser: User, @Param() paramId: string) {
    return this.userService.deleteUser(currentUser.id, paramId);
  }
}
