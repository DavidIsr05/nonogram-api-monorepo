import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(personalNumber: number, password: string) {
    const user = await this.userService.getUserByPersonalNumber(personalNumber);
    console.log(password);
    console.log(user.password);
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, personalNumber: user.personalNumber };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
