import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import upload from "../config/upload_config";

const router = Router();
const userController = new UserController();

// 회원가입
router.post(
  "/regi",
  upload.single("regi_info"),
  wrapAsync(userController.addUser)
);

router.post(
  "/regi/upload",
  upload.single("profile"),
  wrapAsync(userController.saveProfileImage)
);

// 로그인
router.post(
  "/login",
  upload.array("login_info"),
  wrapAsync(userController.login)
);
router.get("/login/social", wrapAsync(userController.socialConnection));
router.get("/redirect", wrapAsync(userController.socialLogin));

// 로그아웃

export default router;
