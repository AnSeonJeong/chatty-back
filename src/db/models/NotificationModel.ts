import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DefaultScope,
} from "sequelize-typescript";
import { Room } from "./RoomModel";
import { User } from "./UserModel";

@DefaultScope(() => ({
  attributes: { exclude: ["id"] },
}))
@Table({ tableName: "notification", timestamps: false })
export class Notification extends Model {
  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  room_id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  count!: number;
}
