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

  @Column({ type: DataType.JSON, allowNull: false })
  nonogram: boolean[][];

  @Column({ type: DataType.STRING, allowNull: false })
  imageBase64: string;

  @Column({ type: DataType.STRING, allowNull: false })
  previewImageBase64: string;

  @Column({ type: DataType.STRING, allowNull: false })
  completeNonogramImageBase64: string;

  @Column({ type: DataType.DOUBLE, allowNull: false })
  pixelHighlightValue: number;

  @HasOne(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  creatorId: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isPrivate: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(NonogramDifficulties)),
    allowNull: false,
  })
  difficulty: NonogramDifficultiesEnumType;
}
