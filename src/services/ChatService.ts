import { Chatting } from "../db/models/ChattingModel";
import { Notification } from "../db/models/NotificationModel";
import { RoomMember } from "../db/models/RoomMemberModel";
import { Room } from "../db/models/RoomModel";
import { User } from "../db/models/UserModel";
import { BadRequest } from "../errors/BadRequest";
import { Op } from "sequelize";
import { InternalServerError } from "../errors/InternalServerError";

export class ChatService {
  // 채팅방 목록 불러오기
  public getChatrooms = async (id: number) => {
    // 회원이 속한 모든 채팅방 멤버
    const roomMembers = await RoomMember.findAll({
      attributes: ["room_id", "is_member"],
      where: { user_id: id },
    });

    const roomIds = roomMembers.map((roomMember) => {
      if (roomMember.room_id && roomMember.is_member !== false) {
        return roomMember.room_id;
      }
      return null;
    });

    let chatroomList = [];

    if (roomIds) {
      // 채팅방 목록 불러오기
      const chatrooms = await Room.findAll({
        attributes: ["id", "name"],
        where: { id: roomIds },
      });
      // 각 채팅방의 마지막 메시지 가져오기
      for (const chatroom of chatrooms) {
        const lastMessage = await Chatting.findOne({
          where: { room_id: chatroom.id },
          order: [["chat_id", "DESC"]],
        });

        if (lastMessage) {
          const getUserProfileImageAndNickname =
            await this.getUserProfileImageAndNickname(chatroom.id, id);

          const notification = await Notification.findOne({
            where: {
              room_id: chatroom.id,
              user_id: id,
            },
          });

          // 클라이언트에 전달할 데이터
          const chatroomData = {
            id: chatroom.id,
            name: getUserProfileImageAndNickname?.nickname,
            member_id: getUserProfileImageAndNickname?.member_id,
            lastMessage:
              lastMessage.text ||
              lastMessage.image ||
              lastMessage.originalDocName,
            lastUpdatedAt: lastMessage.createdAt,
            chatThumnail: getUserProfileImageAndNickname?.profile,
            notification: notification?.count || 0,
          };

          chatroomList.push(chatroomData);
        }
      }

      const sortedChatroomList = chatroomList.sort(
        (a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime()
      );

      return sortedChatroomList;
    } else throw new BadRequest("채팅 목록이 없습니다.");
  };

  // 채팅방 썸네일 이미지, 상대방 닉네임 불러오기
  private getUserProfileImageAndNickname = async (
    roomId: number,
    id: number
  ) => {
    console.log(roomId, id);

    const roomMember = await RoomMember.findOne({
      where: {
        room_id: roomId,
        user_id: { [Op.not]: id },
      },
      include: [
        {
          model: User,
          attributes: ["profile", "nickname", "id", "del"],
        },
      ],
      raw: true,
    });

    if (roomMember) {
      const roomMemberString = JSON.stringify(roomMember);
      const roomMemberObject = JSON.parse(roomMemberString);

      const profile = roomMemberObject["user.profile"];
      const nickname = roomMemberObject["user.nickname"];
      const member_id = roomMemberObject["user.id"];
      const del = roomMemberObject["user.del"];

      if (del === 1)
        return {
          profile: null,
          nickname: "알 수 없음",
          member_id: null,
        };

      return {
        profile: profile,
        nickname: nickname,
        member_id: member_id,
      };
    }
    return null;
  };

  // 해당 채팅방의 채팅내역 모두 불러오기
  public getChatList = async (roomId: number, id: number) => {
    const roomMember = await RoomMember.findOne({
      where: { room_id: roomId, user_id: id, is_member: false },
    });
    console.log("roomMember=", roomMember);

    if (!roomMember) {
      const chatList = await Chatting.findAll({ where: { room_id: roomId } });

      const chatListWithProfile = await Promise.all(
        chatList.map(async (chat) => {
          const user = await User.findOne({
            attributes: ["profile", "nickname", "del"],
            where: { id: chat.sender_id },
          });
          const del = user ? user.del : null;
          let profile = user ? user.profile : null;
          let nickname = user ? user.nickname : null;

          if (del) {
            profile = null;
            nickname = "알 수 없음";
          }

          return { ...chat.toJSON(), profile, nickname }; // 채팅과 프로필, 닉네임 정보를 병합하여 반환
        })
      );
      return chatListWithProfile;
    } else return;
  };

  // 채팅방 민들고 멤버 추가하기
  public createChatroomWithMembers = async (
    memberIds: number[],
    nicknames: string[]
  ) => {
    try {
      // 채팅방 만들기
      const nicknameString = nicknames.join(", ");
      const room = await Room.create({ name: nicknameString });
      if (!room) throw new BadRequest("채팅방 생성 실패!");

      // 채팅방 멤버 추가하기
      memberIds.map((memId) => {
        const roomMember = RoomMember.create(
          {
            room_id: room.id,
            user_id: memId,
          },
          { fields: ["room_id", "user_id", "createdAt"] }
        );
        if (!roomMember) throw new BadRequest("채팅방 멤버 추가 실패");
      });

      return room.id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // 채팅 저장하기
  public saveChatting = async (chatData: any) => {
    try {
      const room_id = chatData.room_id;
      // 해당 채팅방의 최대 chat_id 조회
      const maxChatId = await Chatting.max("chat_id", {
        where: { room_id },
      });
      // chat_id 계산
      const chat_id: number = ((maxChatId ?? 0) as number) + 1;
      // 채팅 데이터 삽입
      const chatting = await Chatting.create(
        { ...chatData, chat_id: chat_id },
        {
          fields: [
            "room_id",
            "sender_id",
            "chat_id",
            "text",
            "image",
            "document",
            "originalDocName",
            "createdAt",
          ],
        }
      );

      return chatting;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // 채팅 멤버 조회
  public getChatroomMember = async (userId: number, memberId: number) => {
    try {
      // 해당 멤버가 속한 채팅방 목록
      const roomMembers = await RoomMember.findAll({
        attributes: ["room_id"],
        where: { user_id: memberId, is_member: { [Op.not]: false } },
      });
      // 내가 속한 채팅방 목록
      const myRooms = await RoomMember.findAll({
        attributes: ["room_id"],
        where: { user_id: userId, is_member: { [Op.not]: false } },
      });
      // room_id만 추출 후, 일치하는 room_id 반환
      const memberRoomIds = roomMembers.map((roomMember) => roomMember.room_id);
      const myRoomIds = myRooms.map((myRoom) => myRoom.room_id);

      let roomId;
      memberRoomIds.forEach((memRoomId) => {
        if (myRoomIds.includes(memRoomId)) roomId = memRoomId;
      });

      return roomId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // 알림수 저장 및 업데이트
  public saveOrUpdateNotification = async (
    roomId: number,
    userId: number,
    notiCnt: number
  ) => {
    try {
      const [notification, created] = await Notification.findOrCreate({
        where: { room_id: roomId, user_id: userId },
        defaults: { count: notiCnt },
      });

      // 알림수 업데이트
      if (notification) {
        if (notification.count === notiCnt) {
          return "update skipped"; // 이전 값과 새로운 값이 같으므로 업데이트 X
        } else {
          notification.count = notiCnt;
          await notification.save();
          return "update success";
        }
      } else if (created) {
        return "create success";
      } else {
        throw new InternalServerError("알림수 저장 및 업데이트 실패");
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // 채팅방 나가기
  public exitChatroom = async (roomId: number, userId: number) => {
    try {
      const roomMember = await RoomMember.update(
        { is_member: false },
        { where: { room_id: roomId, user_id: userId } }
      );

      if (roomMember[0]) {
        return !!roomMember[0];
      } else throw new BadRequest("채팅방 나가기 실패");
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // 채팅방 검색
  public searchChats = async (id: number, nickname: string) => {
    try {
      // 해당 회원 조회
      const user = await User.findOne({
        attributes: ["id"],
        where: { nickname: { [Op.like]: `%${nickname}%` }, del: false },
      });

      if (user) {
        const chatrooms = await this.getChatrooms(id);

        // 해당 회원이 있는 채팅방만 필터링
        const result = chatrooms.filter((room) => room.member_id === user.id);

        if (result.length > 0) return result;
        else throw new BadRequest("채팅기록이 존재하지 않습니다.");
      } else throw new BadRequest("존재하지 않는 회원입니다.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
}
