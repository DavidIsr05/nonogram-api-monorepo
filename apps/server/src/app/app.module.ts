import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../modules/user/entity/user.entity';
import { Nonogram } from '../modules/nonogram/entity/nonogram.entity';
import { Game } from '../modules/game/entity/game.entity';
import { UserModule } from '../modules/user/user.module';
import { NonogramModule } from '../modules/nonogram/nonogram.module';
import { GameModule } from '../modules/game/game.module';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
