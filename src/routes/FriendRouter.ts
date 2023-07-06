import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import { FriendController } from "../controllers/FriendController";

const router = Router();
const friendController = new FriendController();

// 친구 목록 불러오기
router.get("/main/friends", wrapAsync(friendController.getAllFriends));

// 친구 요청, 삭제
router.post("/friends/add/:friend_id", wrapAsync(friendController.addFriend));
router.post(
  "/friends/remove/:friend_id",
  wrapAsync(friendController.removeFriend)
);

export default router;
