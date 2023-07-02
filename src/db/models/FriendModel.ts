import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DefaultScope,
} from "sequelize-typescript";
import { User } from "./UserModel";

@DefaultScope(() => ({
  attributes: {
    exclude: ["id"],
  },
}))
@Table({ tableName: "friends", timestamps: false })
export class Friend extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  friend_id!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  })
  status!: boolean;
}
