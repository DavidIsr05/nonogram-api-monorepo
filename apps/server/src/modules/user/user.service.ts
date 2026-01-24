import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
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

  private readonly logger = new Logger(UserService.name);

  async createUser(createUserDto) {
    const user = await this.getUserByPersonalNumber(
      //TODO CR comment: "make it unit" was not clear
      //how will the nonogram tiles get checked in the middle of the game? each click call to api or we send the nonogram?
      createUserDto.personalNumber
    );

    if (user) {
      this.logger.log(
        'User tried to create an account with used personal number'
      );
      throw new UserAlreadyExistsException(createUserDto.personalNumber);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const salt = await bcrypt.genSalt(saltRounds);

    createUserDto = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, salt),
    };

    try {
      this.logger.log('Creating new user', { createUserDto }); //loged craete user dto *with password*
      return this.parseObjectForReturn(
        await this.userModel.create(createUserDto)
      );
    } catch (error) {
      this.logger.error('Could not create user', error.stack, {
        createUserDto,
      });
      throw new BadRequestException('Could not create user', error);
    }
  }

  async getUserByPersonalNumber(personalNumber) {
    try {
      this.logger.log('Getting user by personal number', { personalNumber });
      return await this.userModel.findOne({
        where: {
          personalNumber: personalNumber,
        },
      });
    } catch (error) {
      this.logger.error(
        'Could not get a user with personla number',
        error.stack,
        { personalNumber }
      );
      throw new UserNotFoundException(error, personalNumber);
    }
  }

  async getUserById(currentUser, userId) {
    if (currentUser.id !== userId) {
      this.logger.log('User tried accesing other users data');
      throw new ForbiddenException(
        'You are not allowed to access other users data'
      );
    }

    try {
      this.logger.log('Getting user by ID', { userId });
      return this.parseObjectForReturn(
        await this.userModel.findOne({
          where: { id: userId },
        })
      );
    } catch (error) {
      this.logger.error('Could not get user by ID', error.stack, { userId });
      throw new UserNotFoundException(error, userId);
    }
  }

  async updateUser(currentUser, userUpdateDto) {
    if (currentUser.id !== userUpdateDto.id) {
      this.logger.log('User tried updating other users data');
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
      this.logger.log('Updating user', { currentUser });
      this.logger.log('Updated user', { user });
      return this.parseObjectForReturn(await user.save());
    } catch (error) {
      this.logger.error('Could not update user', error.stack, { user });
      throw new BadRequestException(
        'Could not update user with ID: ' + user.id,
        error
      );
    }
  }

  async deleteUser(currentUser, userId) {
    if (currentUser.id !== userId) {
      this.logger.log('User tried deleting other users account');
      throw new ForbiddenException('You can not delete other users');
    }

    try {
      this.logger.log('Deleting user with ID', { userId });
      return await this.userModel.destroy({
        where: { id: userId },
      });
    } catch (error) {
      this.logger.error('Could not delete user with ID', error.stack, {
        userId,
      });
      throw new BadRequestException(
        'Could not delete user with ID: ' + userId,
        error
      );
    }
  }

  parseObjectForReturn(object) {
    this.logger.log('Parsing user object for return');
    return UserResponseSchema.parse(object.toJSON());
  }
}
