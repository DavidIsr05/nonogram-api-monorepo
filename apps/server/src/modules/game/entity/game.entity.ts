import {
  Column,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { TileStates, TileStatesEnumType } from '@nonogram-api-monorepo/types';
import { User } from '../../user/entity/user.entity';
import { Nonogram } from '../../nonogram/entity/nonogram.entity';

@Table
export class Game extends Model<Partial<Game>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @HasOne(() => User)
  @Column(DataType.UUIDV4)
  userId: string;

  @HasOne(() => Nonogram)
  @Column(DataType.STRING)
  nonogramId: string;

  @Column(DataType.ENUM(...Object.values(TileStates)))
  uncompletedNonogram: TileStatesEnumType[][] | null;

  @Default(0)
  @Column(DataType.INTEGER)
  timer: number;

  @Default(3)
  @Column(DataType.INTEGER)
  hints: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isFinished: boolean;

  @Default(null)
  @Column(DataType.INTEGER)
  rating: number | null;
}
