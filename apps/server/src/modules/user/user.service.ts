import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { UserAlreadyExistsException } from './exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createUser(createUserDto) {
    const user = await this.userModel.findOne({
      where: {
        personalNumber: createUserDto.personalNumber,
      },
    });

    if (user) {
      throw new UserAlreadyExistsException(createUserDto.personalNumber);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const salt = await bcrypt.genSalt(saltRounds);

    createUserDto = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, salt),
    };

    this.userModel.create(createUserDto);
  }

  async findOne(personalNumber): Promise<User | null> {
    return this.userModel.findOne({
      where: {
        personalNumber: personalNumber,
      },
    });
  }

  async getUser(id) {
    return this.userModel.findOne({
      where: { id },
    });
  }

  async updateUser(id, userUpdateDto) {
    const user = await this.userModel.findOne({
      where: { id },
    });

    user.set({
      ...userUpdateDto,
    });

    await user.save();
  }

  deleteUser(id) {
    this.userModel.destroy({
      where: { id },
    });
  }
}
