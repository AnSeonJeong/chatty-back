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
          const userProfileImage = await this.getUserProfileImage(
            chatroom.id,
            id
          );

          // 클라이언트에 전달할 데이터
          const chatroomData = {
            id: chatroom.id,
            name: chatroom.name,
            lastMessage:
              lastMessage.text || lastMessage.image || lastMessage.file,
            lastUpdatedAt: lastMessage.createdAt,
            chatThumnail: userProfileImage,
          };

          chatroomList.push(chatroomData);
        }
      }
      return chatroomList;
    } else throw new BadRequest("채팅 목록이 없습니다.");
  };

  // 채팅방 썸네일 이미지 불러오기
  private getUserProfileImage = async (roomId: number, id: number) => {
    console.log(roomId, id);
    const roomMember = await RoomMember.findOne({
      where: {
        room_id: roomId,
        user_id: { [Op.not]: id },
      },
      include: [{ model: User, attributes: ["profile"] }],
      raw: true,
    });

    if (roomMember) {
      const roomMemberString = JSON.stringify(roomMember);
      const roomMemberObject = JSON.parse(roomMemberString);
      const profile = roomMemberObject["user.profile"];

      return profile;
    }
    return null;
  };
}
