import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./userModel";
import { Room } from "./roomModel";

@Table({ tableName: "chatting" })
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

  @Column({ type: DataType.STRING })
  image!: string;

  @Column({ type: DataType.STRING })
  file!: string;

  @Column({ type: DataType.STRING })
  text!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;
}
