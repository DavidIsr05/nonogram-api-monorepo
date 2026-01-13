import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  [x: string]: any;
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  createUser(createUserDto) {
    return this.task.create(createUserDto);
  }
}
