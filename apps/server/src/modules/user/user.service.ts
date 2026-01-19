import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createUser(personalNumber, createUserDto) {
    const user = await this.userModel.findOne({
      where: {
        personalNumber: personalNumber,
      },
    });

    if (user) {
      throw new UserAlreadyExistsException(personalNumber);
    }
    return this.userModel.create(createUserDto);
  }

  async findOne(personalNumber): Promise<User | undefined> {
    return this.userModel.findOne({
      where: {
        personalNumber: personalNumber,
      },
    });
  }

  async getUser(id) {
    return this.userModel.findOne({
      where: {
        id: id,
      },
    });
  }

  async getGlobalLeaders() {}

  async updateUser(id, userUpdateDto) {
    const user = await this.userModel.findOne({
      where: {
        id: id,
      },
    });

    user.set({
      ...userUpdateDto,
    });

    return await user.save();
  }

  deleteUser(id) {
    this.userModel.destroy({
      where: {
        id: id,
      },
    });
  }
}
