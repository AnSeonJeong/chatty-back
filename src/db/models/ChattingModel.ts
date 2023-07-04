import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DefaultScope,
} from "sequelize-typescript";
import { User } from "./UserModel";
import { Room } from "./RoomModel";

@DefaultScope(() => ({
  attributes: {
    exclude: ["id"],
  },
}))
@Table({ tableName: "chatting", timestamps: false })
export class Chatting extends Model {
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
  sender_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chat_id!: number;

  @Column({ type: DataType.STRING(100) })
  image!: string;

  @Column({ type: DataType.STRING(200) })
  file!: string;

  @Column({ type: DataType.STRING(1000) })
  text!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
  })
  createdAt!: Date;
}
