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
      //TODO CR comment: "make it unit" was not clear
      //how will the nonogram tiles get checked in the middle of the game? each click call to api or we send the nonogram?
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
      return this.parseObjectForReturn(
        await this.userModel.create(createUserDto)
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

  async getUserById(currentUser, userId) {
    if (currentUser.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access other users data'
      );
    }

    try {
      return this.parseObjectForReturn(
        await this.userModel.findOne({
          where: { id: userId },
        })
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
      return this.parseObjectForReturn(await user.save());
    } catch (error) {
      throw new BadRequestException(
        'Could not update user with ID: ' + user.id,
        error
      );
    }
  }

  async deleteUser(currentUser, userId) {
    if (currentUser.id !== userId) {
      throw new ForbiddenException('You can not delete other users');
    }

    try {
      return await this.userModel.destroy({
        where: { id: userId },
      });
    } catch (error) {
      throw new BadRequestException(
        'Could not delete user with ID: ' + userId,
        error
      );
    }
  }

  parseObjectForReturn(object) {
    return UserResponseSchema.parse(object.toJSON());
  }
}
