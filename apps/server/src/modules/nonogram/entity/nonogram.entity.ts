import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Table({ tableName: 'nonograms' })
export class Nonogram extends Model<Partial<Nonogram>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.JSON,
  })
  matrix: boolean[][];

  @Column({ type: DataType.STRING })
  imageBase64: string;

  @Column({ type: DataType.STRING })
  creatorId: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  isPrivate: boolean;

  @Column({ type: DataType.ENUM(...Object.values(Difficulty)) })
  difficulty: Difficulty;
}
