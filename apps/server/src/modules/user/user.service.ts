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
import { Game } from '../game/entity/game.entity';
import { Nonogram } from '../nonogram/entity/nonogram.entity';
import { ValidationError } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

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

  async getGlobalLeaders() {
    try {
      const globalLeaders = await this.userModel.findAll({
        group: [
          'User.id',
          'User.username',
          'games.timer',
          'games.id',
          'difficulty',
          'games->nonogram.id',
          'games->nonogram->games.id',
        ],
        order: [
          ['username', 'ASC'],
          ['games', 'timer', 'ASC'],
          ['games', 'nonogram', 'games', 'timer', 'ASC'],
        ],
        attributes: ['username'],
        include: [
          {
            model: Game,
            include: [
              {
                model: Nonogram,
                where: { isPrivate: false },
                attributes: [
                  'difficulty',
                  'id',
                  [
                    Sequelize.fn(
                      'COUNT',
                      Sequelize.col('games->nonogram->games')
                    ),
                    'sum',
                  ],
                ],
                include: [
                  {
                    model: Game,
                    where: { isFinished: true },
                    attributes: [
                      'id',
                      [
                        Sequelize.fn(
                          'COUNT',
                          Sequelize.col('games->nonogram->games')
                        ),
                        'count',
                      ],
                    ],
                  },
                ],
              },
            ],
            attributes: ['nonogramId', 'timer'],
            where: { isFinished: true },
            required: true,
          },
        ],
      });
      this.logger.log('Got global leaders successfully', { globalLeaders });
      return globalLeaders;
    } catch (error) {
      throw new BadRequestException(
        'Could not get global leaders',
        error.stack
      );
    }
  }
}
