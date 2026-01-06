import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../modules/user/entity/user.entity';
import { Nonogram } from '../modules/nonogram/entity/nonogram.entity';
import { Game } from '../modules/game/entity/game.entity';
import { UserModule } from '../modules/user/user.module';
import { NonogramModule } from '../modules/nonogram/nonogram.module';
import { GameModule } from '../modules/game/game.module';
import { NonogramController } from '../modules/nonogram/nonogram.controller';
import { UserController } from '../modules/user/user.controller';
import { GameController } from '../modules/game/game.controller';
import { NonogramService } from '../modules/nonogram/nonogram.service';
import { UserService } from '../modules/user/user.service';
import { GameService } from '../modules/game/game.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nonogramdb',
      models: [User, Nonogram, Game],
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
    NonogramModule,
    GameModule,
  ],
  controllers: [NonogramController, UserController, GameController],
  providers: [NonogramService, UserService, GameService],
})
export class AppModule {}
