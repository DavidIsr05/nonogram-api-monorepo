import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { UserAlreadyExistsException } from './exceptions';
import * as bcrypt from 'bcrypt';
import { UserResponseSchema } from '@nonogram-api-monorepo/types';

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

    return UserResponseSchema.parse(
      (await this.userModel.create(createUserDto)).toJSON()
    );
  }

  async getUserByPersonalNumber(personalNumber): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        personalNumber: personalNumber,
      },
    });
  }

  async getUserById(paramId, userId) {
    if (paramId.id !== userId) {
      throw new UnauthorizedException();
    }

    return UserResponseSchema.parse(
      (
        await this.userModel.findOne({
          where: { id: userId },
        })
      ).toJSON()
    );
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

    return UserResponseSchema.parse((await user.save()).toJSON());
  }

  async deleteUser(id, userId) {
    if (id !== userId) {
      throw new UnauthorizedException();
    }

    return await this.userModel.destroy({
      where: { id },
    });
  }
}
