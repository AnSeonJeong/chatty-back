import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { wrapAsync } from "../utils/wrapAsyncUtil";

const router = Router();
const userController = new UserController();

// 회원가입
router.post("/regi", wrapAsync(userController.addUser));

// 로그인
router.get("/login/social", wrapAsync(userController.socialConfig));
router.get("/redirect", wrapAsync(userController.socialLogin));

// 로그아웃

export default router;
