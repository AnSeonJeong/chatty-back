import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import { FriendController } from "../controllers/FriendController";

const router = Router();
const friendController = new FriendController();

router.get("/main/friends", wrapAsync(friendController.getAllFriends));

export default router;
