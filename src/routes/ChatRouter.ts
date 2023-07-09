import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import { ChatController } from "../controllers/ChatController";
import upload from "../config/upload_config";

const router = Router();
const chatController = new ChatController();

// 채팅방 목록 불러오기
router.get("/chats", wrapAsync(chatController.getChatrooms));

// 채팅 목록 불러오기 및 채팅 기록
router.get("/chats/:room_id", wrapAsync(chatController.getChatList));
router.post(
  "/chats/:room_id/message",
  upload.single("send_message"),
  wrapAsync(chatController.saveChatting)
);

// 채팅방 생성 및 멤버 추가
router.post(
  "/chats/chatroom",
  wrapAsync(chatController.createChatroomWithMembers)
);

// 채팅멤버 여부 확인
router.get(
  "/chats/member/:mem_id",
  wrapAsync(chatController.getChatroomMember)
);

export default router;
