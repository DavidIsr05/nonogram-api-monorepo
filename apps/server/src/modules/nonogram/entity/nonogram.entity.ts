import {
  Column,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import {
  NonogramDifficulties,
  NonogramDifficultiesEnumType,
} from '@nonogram-api-monorepo/types';
import { User } from '../../user/entity/user.entity';

@Table
export class Nonogram extends Model<Partial<Nonogram>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.JSON)
  nonogram: boolean[][];

  @Column(DataType.STRING)
  imageBase64: string;

  @Column(DataType.STRING)
  previewImageBase64: string;

  @Column(DataType.STRING)
  completeNonogramImageBase64: string;

  @Column(DataType.DOUBLE)
  pixelHighlightValue: number;

  @HasOne(() => User)
  @Column(DataType.STRING)
  creatorId: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isPrivate: boolean;

  @Column(DataType.ENUM(...Object.values(NonogramDifficulties)))
  difficulty: NonogramDifficultiesEnumType;
}
