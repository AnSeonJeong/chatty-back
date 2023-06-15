import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Friend } from "./friendModel";
import { Chatting } from "./chattingModel";
import { roomMember } from "./roomMemberModel";

@Table({ tableName: "user" })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  intro!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  birth!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
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
    allowNull: false,
  })
  del!: boolean;

  // 1:N 관계 설정
  @HasMany(() => Friend)
  friends!: Friend[];

  @HasMany(() => Chatting)
  chatting!: Chatting[];

  @HasMany(() => roomMember)
  room_members!: roomMember[];
}
