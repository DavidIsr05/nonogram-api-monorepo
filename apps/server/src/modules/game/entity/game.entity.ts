import {
  AllowNull,
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
  @Column({ type: DataType.UUIDV4, allowNull: false })
  userId: string;

  @HasOne(() => Nonogram)
  @Column({ type: DataType.STRING, allowNull: false })
  nonogramId: string;

  @Column(DataType.ENUM(...Object.values(TileStates)))
  uncompletedNonogram: TileStatesEnumType[][] | null;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  timer: number;

  @Default(3)
  @Column({ type: DataType.INTEGER, allowNull: false })
  hints: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isFinished: boolean;

  @Default(null)
  @Column(DataType.INTEGER)
  rating: number | null;
}
