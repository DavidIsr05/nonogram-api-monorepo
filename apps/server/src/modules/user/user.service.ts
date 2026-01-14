import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  createUser(createUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findOne(personalNumber: string): Promise<User | undefined> {
    return this.userModel.findOne({
      where: {
        personalNumber: personalNumber,
      },
    });
  }
}
