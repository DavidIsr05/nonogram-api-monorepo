import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from './entity/game.entity';

@Module({
  providers: [GameService],
  controllers: [GameController],
  imports: [SequelizeModule.forFeature([Game])],
})
export class GameModule {}
