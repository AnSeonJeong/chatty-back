import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import { FriendController } from "../controllers/FriendController";

const router = Router();
const friendController = new FriendController();

// 친구 목록 불러오기
router.get(
  "/users/:user_id/friends",
  wrapAsync(friendController.getAllFriends)
);

// 친구 요청 보내기
router.post(
  "/users/:user_id/friends/:friend_id/requests",
  wrapAsync(friendController.addFriend)
);

// 친구 삭제
router.delete(
  "/users/:user_id/friends/:friend_id",
  wrapAsync(friendController.removeFriend)
);

// 친구 요청 목록 불러오기
router.get(
  "/users/:user_id/friends/requests",
  wrapAsync(friendController.getAllFriends)
);

// 친구 요청 수락, 거절
router.post(
  "/users/:user_id/friends/:friend_id",
  wrapAsync(friendController.handleFriendRequest)
);

export default router;
