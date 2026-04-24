import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Game } from '../../game/entity/game.entity';
import { Nonogram } from '../../nonogram/entity/nonogram.entity';
import { Exclude, Expose } from 'class-transformer';

@Table
export class User extends Model<Partial<User>> {
  @Expose()
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Expose()
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Exclude()
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Expose()
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  personalNumber: number;

  @Expose()
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isAdmin: boolean;

  @HasMany(() => Game)
  games: Game[];

  @HasMany(() => Nonogram)
  nonograms: Nonogram[];
}
