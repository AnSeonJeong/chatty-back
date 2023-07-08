import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import { ChatController } from "../controllers/ChatController";
import upload from "../config/upload_config";

const router = Router();
const chatController = new ChatController();

router.get("/chats", wrapAsync(chatController.getChatrooms));

router.get("/chats/:room_id", wrapAsync(chatController.getChatList));
router.post(
  "/chats/:room_id/message",
  upload.single("send_message"),
  wrapAsync(chatController.saveChatting)
);

export default router;
