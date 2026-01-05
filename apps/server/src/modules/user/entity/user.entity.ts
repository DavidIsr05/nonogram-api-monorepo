import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<Partial<User>> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
  })
  username: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING })
  firstName: string;

  @Column({ type: DataType.STRING })
  lastName: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isAdmin: boolean;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  globalScore: number;
}
