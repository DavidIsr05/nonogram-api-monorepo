import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly user: typeof User) {}
}
