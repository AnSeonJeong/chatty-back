import { Chatting } from "../db/models/ChattingModel";
import { RoomMember } from "../db/models/RoomMemberModel";
import { Room } from "../db/models/RoomModel";
import { User } from "../db/models/UserModel";
import { BadRequest } from "../errors/BadRequest";
import { Op } from "sequelize";

export class ChatService {
  // 채팅방 목록 불러오기
  public getChatrooms = async (id: number) => {
    // 회원이 속한 모든 채팅방 멤버
    const roomMembers = await RoomMember.findAll({
      attributes: ["room_id"],
      where: { user_id: id },
    });

    const roomIds = roomMembers.map((roomMember) => roomMember.room_id);

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

          // 클라이언트에 전달할 데이터
          const chatroomData = {
            id: chatroom.id,
            name: getUserProfileImageAndNickname?.nickname,
            member_id: getUserProfileImageAndNickname?.member_id,
            lastMessage:
              lastMessage.text || lastMessage.image || lastMessage.file,
            lastUpdatedAt: lastMessage.createdAt,
            chatThumnail: getUserProfileImageAndNickname?.profile,
          };

          chatroomList.push(chatroomData);
        }
      }
      return chatroomList;
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
      include: [{ model: User, attributes: ["profile", "nickname", "id"] }],
      raw: true,
    });
    if (roomMember) {
      const roomMemberString = JSON.stringify(roomMember);
      const roomMemberObject = JSON.parse(roomMemberString);
      const profile = roomMemberObject["user.profile"];
      const nickname = roomMemberObject["user.nickname"];
      const member_id = roomMemberObject["user.id"];

      return { profile: profile, nickname: nickname, member_id: member_id };
    }
    return null;
  };

  // 해당 채팅방의 채팅내역 모두 불러오기
  public getChatList = async (roomId: number) => {
    const chatList = await Chatting.findAll({ where: { room_id: roomId } });

    const chatListWithProfile = await Promise.all(
      chatList.map(async (chat) => {
        const user = await User.findOne({
          attributes: ["profile", "nickname"],
          where: { id: chat.sender_id },
        });
        const profile = user ? user.profile : null;
        const nickname = user ? user.nickname : null;

        return { ...chat.toJSON(), profile, nickname }; // 채팅과 프로필, 닉네임 정보를 병합하여 반환
      })
    );

    return chatListWithProfile;
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
            "file",
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
        where: { user_id: memberId },
      });
      // 내가 속한 채팅방 목록
      const myRooms = await RoomMember.findAll({
        attributes: ["room_id"],
        where: { user_id: userId },
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
}
