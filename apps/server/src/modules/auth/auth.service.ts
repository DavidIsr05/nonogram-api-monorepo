import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(personalNumber, password): Promise<any> {
    const user = await this.userService.findOne(personalNumber);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, personalNumber: user.personalNumber };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
