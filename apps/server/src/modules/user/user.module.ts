import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { NonogramModule } from '../nonogram';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User]), NonogramModule],
  exports: [UserService],
})
export class UserModule {}
