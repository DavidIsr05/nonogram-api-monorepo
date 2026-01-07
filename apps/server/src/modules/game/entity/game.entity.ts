import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import {
  TileStatesEnumType,
  TileStatesEnumValues,
} from '@nonogram-api-monorepo/types';

@Table
export class Game extends Model<Partial<Game>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  userId: string;

  @Column(DataType.STRING)
  nonogramId: string;

  @Column(DataType.ENUM(...Object.values(TileStatesEnumValues)))
  uncompletedNonogram: TileStatesEnumType[][];

  @Column(DataType.INTEGER)
  timer: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isFinished: boolean;

  @Column(DataType.INTEGER)
  rating: number | null;
}
