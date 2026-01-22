import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
      throw new BadRequestException('Could not create user', error);
    }
  }

  async getUserByPersonalNumber(personalNumber) {
    try {
      return await this.userModel.findOne({
        where: {
          personalNumber: personalNumber,
        },
      });
    } catch (error) {
      throw new UserNotFoundException(error, personalNumber);
    }
  }

  async getUserById(paramId, userId) {
    if (paramId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access other users data'
      );
    }

    try {
      return await UserResponseSchema.parse(
        (
          await this.userModel.findOne({
            where: { id: userId },
          })
        ).toJSON()
      );
    } catch (error) {
      throw new UserNotFoundException(error, userId);
    }
  }

  async updateUser(currentUser, userUpdateDto) {
    if (currentUser.id !== userUpdateDto.id) {
      throw new ForbiddenException(
        'You are not allowed to edit other users data'
      );
    } else if (userUpdateDto.isAdmin) {
      throw new ForbiddenException('You can not edit this role');
    }

    const user = await this.getUserByPersonalNumber(currentUser.personalNumber);

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
    } catch (error) {
      throw new BadRequestException(
        'Could not update user with ID: ' + user.id,
        error
      );
    }
  }

  async deleteUser(id, userId) {
    if (id !== userId) {
      throw new ForbiddenException('You can not delete other users');
    }

    try {
      return await this.userModel.destroy({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not delete user with ID: ' + id,
        error
      );
    }
  }
}
