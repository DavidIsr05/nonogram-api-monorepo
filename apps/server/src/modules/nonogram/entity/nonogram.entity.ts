import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
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
import { Exclude, Expose } from 'class-transformer';

@Table
export class Nonogram extends Model<Partial<Nonogram>> {
  @Expose()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Exclude()
  @Column({ type: DataType.JSONB, allowNull: false })
  nonogram: { nonogram: boolean[][] };

  @Expose()
  @Column({ type: DataType.TEXT, allowNull: false })
  previewImageBase64: Text;

  @Expose()
  @Column({ type: DataType.TEXT, allowNull: false })
  completeNonogramImageBase64: Text;

  @Expose()
  @Column({ type: DataType.DOUBLE, allowNull: false })
  mainObjectDimFactor: number;

  @Expose()
  @Column({
    type: DataType.ENUM(...Object.values(NonogramDifficulties)),
    allowNull: false,
  })
  difficulty: NonogramDifficultiesEnumType;

  @Expose()
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  creatorId: string;

  @Expose()
  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isPrivate: boolean;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Game)
  games: Game[];
}
