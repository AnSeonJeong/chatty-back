import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Chatting } from "./chattingModel";
import { roomMember } from "./roomMemberModel";

@Table({ tableName: "rooms" })
export class Room extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
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

  @HasMany(() => roomMember)
  room_members!: roomMember[];
}
