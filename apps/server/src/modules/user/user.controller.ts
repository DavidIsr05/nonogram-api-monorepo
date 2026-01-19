import { Body, Controller, Patch, Post } from '@nestjs/common';
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

  @Patch('edit')
  edituser(@Body() updateUserDto: UpdateUserDto) {}
}
