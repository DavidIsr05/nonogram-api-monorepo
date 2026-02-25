import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, UserSignInDto } from '../../common';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Response() res,
    @Body(new ZodValidationPipe(UserSignInDto)) signInDto: UserSignInDto
  ) {
    const { access_token } = await this.authService.signIn(
      signInDto.personalNumber,
      signInDto.password
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, //TODO change to true in prod
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return res.json({ access_token });
  }
}
