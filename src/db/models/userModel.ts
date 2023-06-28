import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Friend } from "./friendModel";
import { Chatting } from "./chattingModel";
import { RoomMember } from "./roomMemberModel";

@Table({ tableName: "users" })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  nickname!: string;

  @Column({
    type: DataType.STRING(80),
    allowNull: true,
  })
  password!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  intro!: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  type!: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  social_id!: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  profile!: string;

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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  del!: boolean;

  // 1:N 관계 설정
  @HasMany(() => Friend)
  friends!: Friend[];

  @HasMany(() => Chatting)
  chatting!: Chatting[];

  @HasMany(() => RoomMember)
  room_members!: RoomMember[];
}
