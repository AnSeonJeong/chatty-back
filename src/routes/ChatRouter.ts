import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import { ChatController } from "../controllers/ChatController";
import upload from "../config/upload_config";

const router = Router();
const chatController = new ChatController();

router.get("/chats", (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    // 쿼리 파라미터가 있는 경우 (채팅방 검색)
    wrapAsync(chatController.searchChats)(req, res, next);
  } else {
    // 쿼리 파라미터가 없는 경우 (채팅방 목록 불러오기)
    wrapAsync(chatController.getChatrooms)(req, res, next);
  }
});

// 해당 채팅방의 채팅 목록 불러오기
router.get("/chats/:room_id", wrapAsync(chatController.getChatList));

// 채팅 메시지 저장
router.post(
  "/chats/:room_id/messages",
  upload.single("send_message"),
  wrapAsync(chatController.saveChatting)
);

// 채팅방 생성 및 멤버 추가
router.post("/chats", wrapAsync(chatController.createChatroomWithMembers));

// 채팅멤버 여부 확인
router.get(
  "/chats/users/:user_id",
  wrapAsync(chatController.getChatroomMember)
);

// 채팅 이미지 저장
router.post(
  "/chats/:room_id/chat-images",
  upload.single("chatImage"),
  wrapAsync(chatController.saveChatImage)
);

// 채팅 문서 저장
router.post(
  "/chats/:room_id/chat-documents",
  upload.single("chatDocument"),
  wrapAsync(chatController.saveChatDocument)
);

// 알림수 저장 및 업데이트
router.post(
  "/chats/:room_id/notifications",
  wrapAsync(chatController.saveOrUpdateNotification)
);

// 채팅방 나가기
router.post("/chats/:room_id/exit", wrapAsync(chatController.exitChatroom));

export default router;
