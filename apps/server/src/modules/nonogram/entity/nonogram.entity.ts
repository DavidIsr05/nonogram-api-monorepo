import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
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
import { Game } from '../../game/entity/game.entity';

@Table
export class Nonogram extends Model<Partial<Nonogram>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  nonogram: { nonogram: boolean[][] };

  @Column({ type: DataType.TEXT, allowNull: false })
  previewImageBase64: Text;

  @Column({ type: DataType.TEXT, allowNull: false })
  completeNonogramImageBase64: Text;

  @Column({ type: DataType.DOUBLE, allowNull: false })
  pixelHighlightValue: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  creatorId: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isPrivate: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(NonogramDifficulties)),
    allowNull: false,
  })
  difficulty: NonogramDifficultiesEnumType;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Game)
  games: Game[];
}
