import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import {
  ForbiddenUserException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../../common';
import * as bcrypt from 'bcrypt';
import { UserResponseSchema } from '@nonogram-api-monorepo/types';
import { ValidationError, col, fn } from 'sequelize';
import { Game } from '../game/entity/game.entity';
import { Nonogram } from '../nonogram/entity/nonogram.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  private readonly logger = new Logger(UserService.name);

  async createUser(createUserDto) {
    const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT);

    createUserDto = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, salt),
    };

    try {
      const createdUser = this.parseObjectForReturn(
        await this.userModel.create(createUserDto)
      );
      this.logger.log('Created new user successfully', { createdUser });
      return createdUser;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new UserAlreadyExistsException(createUserDto.personalNumber);
      }
      throw new BadRequestException('Could not create user', error.stack);
    }
  }

  async getUserByPersonalNumber(personalNumber) {
    try {
      const foundUserByPersonalNumber = await this.userModel.findOne({
        where: {
          personalNumber: personalNumber,
        },
      });
      if (!foundUserByPersonalNumber) {
        throw new UserNotFoundException(personalNumber);
      }
      this.logger.log('Found user by personla number successfully', {
        foundUserByPersonalNumber,
      });
      return foundUserByPersonalNumber;
    } catch (error) {
      throw new UserNotFoundException(error.stack, personalNumber);
    }
  }

  async getUserById(currentUser, userId) {
    if (currentUser.id !== userId) {
      throw new ForbiddenUserException();
    }

    try {
      const foundUserById = this.parseObjectForReturn(
        await this.userModel.findByPk(userId)
      );
      this.logger.log('Found user by ID successfully', { foundUserById });
      return foundUserById;
    } catch (error) {
      throw new UserNotFoundException(error.stack, userId);
    }
  }

  async updateUser(currentUser, userUpdateDto) {
    if (currentUser.id !== userUpdateDto.id) {
      throw new ForbiddenUserException();
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
      const updatedUser = this.parseObjectForReturn(await user.save());
      this.logger.log('Updated user successfully', { updatedUser });
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(
        'Could not update user with ID: ' + user.id,
        error.stack
      );
    }
  }

  async deleteUser(currentUser, userId) {
    if (currentUser.id !== userId) {
      throw new ForbiddenUserException();
    }

    try {
      const deletedUser = await this.userModel.destroy({
        where: { id: userId },
      });
      this.logger.log('Deleted user successfully', { deletedUser });
      return deletedUser;
    } catch (error) {
      throw new BadRequestException(
        'Could not delete user with ID: ' + userId,
        error.stack
      );
    }
  }

  parseObjectForReturn(object) {
    this.logger.log('Parsing user object for return');
    return UserResponseSchema.parse(object.toJSON());
  }

  async getUserStats(currentUser) {
    const userNonogramsAndGames = await this.userModel.findOne({
      where: { id: currentUser.id },
      attributes: [
        [fn('COUNT', fn('DISTINCT', col('nonograms.id'))), 'nonogramsCreated'],
      ],
      include: [
        {
          model: Game,
          where: { userId: currentUser.id },
          attributes: ['isLiked', 'isFinished', 'timer'],
        },
        {
          model: Nonogram,
          where: { creatorId: currentUser.id },
          attributes: [],
        },
      ],
      group: ['User.id', 'games.id'],
    });

    if (!userNonogramsAndGames) {
      return { nonogramsCreated: 0, gamesPlayed: 0, averageTimer: 0, nonogramsLiked: 0, nonogramsComplete: 0 };
    }

    const userStats = {
      nonogramsCreated: Number(userNonogramsAndGames.get('nonogramsCreated')),
      gamesPlayed: userNonogramsAndGames.games.length,
      averageTimer: 0,
      nonogramsLiked: 0,
      nonogramsComplete: 0,
    };

    userNonogramsAndGames.games.map(({ isLiked, isFinished, timer }) => {
      if (isFinished) {
        userStats.nonogramsComplete++;
        if (isLiked) {
          userStats.nonogramsLiked++;
        }
        userStats.averageTimer += timer;
      }
    });

    if (userStats.averageTimer) {
      userStats.averageTimer =
        userStats.averageTimer / userStats.nonogramsComplete;
    }

    this.logger.log('Got user stats succesfully');
    return userStats;
  }
}
