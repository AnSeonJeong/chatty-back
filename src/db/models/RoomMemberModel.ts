import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DefaultScope,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./UserModel";
import { Room } from "./RoomModel";

@DefaultScope(() => ({
  attributes: { exclude: ["id"] },
}))
@Table({ tableName: "room_members", timestamps: false })
export class RoomMember extends Model {
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
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
  })
  createdAt!: Date;

  @BelongsTo(() => User)
  user!: User;
}
