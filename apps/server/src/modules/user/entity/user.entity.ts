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

  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  personalNumber: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isAdmin: boolean;

  @HasMany(() => Game)
  games: Game[];

  @HasMany(() => Nonogram)
  nonograms: Nonogram[];
}
