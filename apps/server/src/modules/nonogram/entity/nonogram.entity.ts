import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import {
  NonogramDifficultiesEnumType,
  NonogramDifficultiesEnumValues,
} from '@nonogram-api-monorepo/types';

@Table({ tableName: 'nonograms' })
export class Nonogram extends Model<Partial<Nonogram>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.JSON)
  matrix: boolean[][];

  @Column(DataType.STRING)
  imageBase64: string;

  @Column(DataType.STRING)
  creatorId: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isPrivate: boolean;

  @Column(DataType.ENUM(...Object.values(NonogramDifficultiesEnumValues)))
  difficulty: NonogramDifficultiesEnumType;
}
