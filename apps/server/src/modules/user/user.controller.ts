import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
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
    @Param('id', new ParseUUIDPipe({ version: '4' })) paramId: string
  ) {
    return this.userService.getUserById(paramId, currentUser.id);
  }

  @Public()
  @Post('signup')
  @UsePipes(new ZodValidationPipe(CreateUserDto))
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch()
  //@UsePipes(new ZodValidationPipe(UpdateUserDto)) //TODO fix the bug of unknows values when validator is on for this route
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User
  ) {
    console.log('HELLO');
    return this.userService.updateUser(currentUser, updateUserDto);
  }

  @Delete(':id')
  deleteUser(
    @CurrentUser() currentUser: User,
    @Param('id', new ParseUUIDPipe({ version: '4' })) paramId: string
  ) {
    return this.userService.deleteUser(currentUser.id, paramId);
  }
}
