import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../../common';
import * as bcrypt from 'bcrypt';
import { UserResponseSchema } from '@nonogram-api-monorepo/types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createUser(createUserDto) {
    const user = await this.getUserByPersonalNumber(
      createUserDto.personalNumber
    );

    if (user) {
      throw new UserAlreadyExistsException(createUserDto.personalNumber);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const salt = await bcrypt.genSalt(saltRounds);

    createUserDto = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, salt),
    };

    try {
      return UserResponseSchema.parse(
        (await this.userModel.create(createUserDto)).toJSON()
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByPersonalNumber(personalNumber): Promise<User | null> {
    try {
      return await this.userModel.findOne({
        where: {
          personalNumber: personalNumber,
        },
      });
    } catch (error) {}
  }

  async getUserById(paramId, userId) {
    if (paramId.id !== userId) {
      throw new UnauthorizedException();
    }

    try {
      return UserResponseSchema.parse(
        (
          await this.userModel.findOne({
            where: { id: userId },
          })
        ).toJSON()
      );
    } catch (error) {
      throw new UserNotFoundException(userId);
    }
  }

  async updateUser(id, userUpdateDto) {
    if (id !== userUpdateDto.id) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel.findOne({
      where: { id },
    });

    if (userUpdateDto.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT);
      const salt = await bcrypt.genSalt(saltRounds);

      userUpdateDto = {
        ...userUpdateDto,
        password: await bcrypt.hash(userUpdateDto.password, salt),
      };
    }

    user.set({
      ...userUpdateDto,
    });

    try {
      return UserResponseSchema.parse((await user.save()).toJSON());
    } catch (error) {}
  }

  async deleteUser(id, userId) {
    if (id !== userId) {
      throw new UnauthorizedException();
    }

    try {
      return await this.userModel.destroy({
        where: { id },
      });
    } catch (error) {}
  }
}
