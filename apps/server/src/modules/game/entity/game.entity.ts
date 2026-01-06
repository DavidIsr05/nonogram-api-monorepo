import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum TileState {
  EMPTY = 'EMPTY',
  FILLED = 'FILLED',
  HINT = 'HINT',
  MISTAKE = 'MISTAKE',
}

@Table({ tableName: 'games' })
export class Game extends Model<Partial<Game>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
  })
  userId: string;

  @Column({ type: DataType.STRING })
  nonogramId: string;

  @Column({ type: DataType.ENUM(...Object.values(TileState)) })
  uncompletedNonogram: TileState[][];

  @Column({ type: DataType.INTEGER })
  timer: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  isFinished: boolean;

  @Column({ type: DataType.INTEGER })
  rating: number | null;
}
