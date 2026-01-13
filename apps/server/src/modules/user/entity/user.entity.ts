import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class User extends Model<Partial<User>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.INTEGER)
  PersonalNumber: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAdmin: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  globalScore: number;

  @Default(0)
  @Column(DataType.NUMBER)
  totalPlayTime: number;
}
