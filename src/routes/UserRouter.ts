import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import multer from "multer";

const router = Router();
const upload = multer();
const userController = new UserController();

// 회원가입
router.post("/regi", wrapAsync(userController.addUser));

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
