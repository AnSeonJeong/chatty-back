import { Op } from "sequelize";
import { Friend } from "../db/models/FriendModel";
import { InternalServerError } from "../errors/InternalServerError";
import { User } from "../db/models/UserModel";
import { BadRequest } from "../errors/BadRequest";

export class FriendService {
  // 친구 목록 불러오기
  public getAllFriends = async (id: number) => {
    try {
      const friendList = await Friend.findAll({
        where: {
          [Op.or]: [{ user_id: id }, { friend_id: id }],
          status: true,
        },
      });
      // 친구 목록에서 회원 ID 추출
      const userIds = friendList.map((friend) =>
        friend.user_id !== id ? friend.user_id : friend.friend_id
      );

      // 회원 정보 조회
      const users = await User.findAll({
        attributes: ["id", "email", "nickname", "profile", "intro"],
        where: {
          id: userIds,
          del: false,
        },
      });

      if (users) return users;
      else throw new BadRequest("친구 목록 불러오기 실패");
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}
