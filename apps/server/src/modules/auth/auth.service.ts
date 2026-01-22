import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from '../../common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(personalNumber: number, password: string) {
    const user = await this.userService.getUserByPersonalNumber(personalNumber);
    if (!user) {
      throw new UserNotFoundException(personalNumber);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { id: user.id, personalNumber: user.personalNumber };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
