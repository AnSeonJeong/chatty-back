import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import { ChatController } from "../controllers/ChatController";

const router = Router();
const chatController = new ChatController();

router.get("/chats", wrapAsync(chatController.getChatrooms));

router.get("/chats/:room_id", wrapAsync(chatController.getChatList));

export default router;
