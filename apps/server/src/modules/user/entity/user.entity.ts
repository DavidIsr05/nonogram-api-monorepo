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

@Table
export class User extends Model<Partial<User>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string; //TODO update the password field to be encripted

  @Column({ type: DataType.INTEGER, allowNull: false })
  personalNumber: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isAdmin: boolean;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  globalScore: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  totalPlayTime: number;

  @HasMany(() => Game)
  games: Game[];

  @HasMany(() => Nonogram)
  nonograms: Nonogram[];
}
