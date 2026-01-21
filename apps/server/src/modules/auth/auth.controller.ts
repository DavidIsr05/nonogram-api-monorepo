import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto } from '@nonogram-api-monorepo/types';
import { Public } from '../../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: UserSignInDto) {
    return this.authService.signIn(
      signInDto.personalNumber,
      signInDto.password
    );
  }
}
