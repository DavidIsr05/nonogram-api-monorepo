import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../modules/user/entity/user.entity';
import { Nonogram } from '../modules/nonogram/entity/nonogram.entity';
import { Game } from '../modules/game/entity/game.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, GameModule, NonogramModule, UserModule } from '../modules';
import { Cipher, EncryptionModule } from '@hedger/nestjs-encryption';

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
      logging: true,
    }),
    EncryptionModule.forRoot({
      key: process.env.KEY,
      cipher: Cipher.AES_256_CBC,
    }),
    UserModule,
    NonogramModule,
    GameModule,
    AuthModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
