import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
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

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => Nonogram)
  @Column({ type: DataType.UUID, allowNull: false })
  nonogramId: string;

  @Column(DataType.JSONB)
  uncompletedNonogram: TileStatesEnumType[][] | null;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  timer: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  hints: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  mistakes: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isFinished: boolean;

  @Column(DataType.INTEGER)
  rating: number | null;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Nonogram)
  nonogram: Nonogram;
}
