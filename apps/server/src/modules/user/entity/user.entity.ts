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

  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  PersonalNumber: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isAdmin: boolean;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  globalScore: number;

  @Default(0)
  @Column({ type: DataType.NUMBER, allowNull: false })
  totalPlayTime: number;
}
