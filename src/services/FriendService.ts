import { Op } from "sequelize";
import { Friend } from "../db/models/FriendModel";
import { User } from "../db/models/UserModel";
import { BadRequest } from "../errors/BadRequest";
import { InternalServerError } from "../errors/InternalServerError";

export class FriendService {
  // 친구 목록 불러오기
  public getAllFriends = async (id: number, status: boolean) => {
    try {
      let friendList;

      if (status) {
        friendList = await Friend.findAll({
          where: {
            [Op.or]: [{ user_id: id }, { friend_id: id }],
            status: status,
          },
        });
      } else {
        friendList = await Friend.findAll({
          where: {
            friend_id: id,
            status: status,
          },
        });
      }

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

  // 친구 여부 확인
  public isFriend = async (id: number, userId: number) => {
    try {
      const friend = await Friend.findOne({
        where: {
          [Op.or]: [
            { user_id: id, friend_id: userId },
            { user_id: userId, friend_id: id },
          ],
          status: true,
        },
      });

      return !!friend;
    } catch (err) {
      console.log(err);
      throw new InternalServerError("친구 여부 확인 불가");
    }
  };

  // 친구 신청
  public addFriend = async (userId: number, friendId: number) => {
    try {
      const [friend, created] = await Friend.findOrCreate({
        where: { user_id: userId, friend_id: friendId },
        fields: ["user_id", "friend_id", "status"],
      });

      if (created) return created ? "친구 신청 완료" : "친구 신청 실패";
      if (friend) throw new BadRequest("친구 신청이 완료된 회원입니다.");
    } catch (err) {
      throw err;
    }
  };

  // 친구 삭제
  public removeFriend = async (userId: number, friendId: number) => {
    try {
      const deletedCount = await Friend.destroy({
        where: { user_id: userId, friend_id: friendId },
      });

      return deletedCount > 0 ? "친구 삭제 완료" : "친구 삭제 실패";
    } catch (err) {
      throw err;
    }
  };

  // 친구 요청 수락
  public acceptFriendRequest = async (id: number, friendId: number) => {
    try {
      const friend = await Friend.update(
        {
          status: true,
        },
        {
          where: {
            user_id: friendId,
            friend_id: id,
            status: false,
          },
        }
      );
      console.log(friend[0]);
      if (friend[0]) {
        return !!friend[0];
      } else throw new BadRequest("존재하지 않는 친구요청");
    } catch (err) {
      throw err;
    }
  };

  // 친구 요청 거절
  public rejectFriendRequest = async (id: number, friendId: number) => {
    try {
      const rejectedCount = await Friend.destroy({
        where: {
          user_id: friendId,
          friend_id: id,
          status: false,
        },
      });

      return rejectedCount > 0 ? true : false;
    } catch (err) {
      throw err;
    }
  };
}
