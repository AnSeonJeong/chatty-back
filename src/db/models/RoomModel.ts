import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Chatting } from "./ChattingModel";
import { RoomMember } from "./RoomMemberModel";

@Table({ tableName: "rooms" })
export class Room extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  name!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;

  @HasMany(() => Chatting)
  chatting!: Chatting[];

  @HasMany(() => RoomMember)
  room_members!: RoomMember[];
}
