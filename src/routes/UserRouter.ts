import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import upload from "../config/upload_config";
import { tokenValidator } from "../middleware/tokenValidator";

const router = Router();
const userController = new UserController();

// 회원가입
router.post(
  "/users",
  upload.single("regi_info"),
  wrapAsync(userController.addUser)
);

// 회원 프로필 이미지 저장 및 수정
router.post(
  "/users/:user_id/profile-images",
  upload.single("profile"),
  wrapAsync(userController.saveAndUpdateProfileImage)
);

// 로그인
router.post(
  "/login",
  upload.array("login_info"),
  wrapAsync(userController.login)
);
router.get("/login/:social", wrapAsync(userController.socialConnection));
router.get("/redirect", wrapAsync(userController.socialLogin));

// 발급받은 토큰 검증
router.use(tokenValidator);
// 사용자 정보 불러오기
router.get("/users/:user_id", wrapAsync(userController.getUser));
router.get("/users", wrapAsync(userController.searchUser));

// 회원 정보 수정
router.patch(
  "/users/:user_id",
  upload.single("update_info"),
  wrapAsync(userController.updateUserInfo)
);

// 회원 탈퇴
router.delete("/users/:user_id", wrapAsync(userController.deleteUser));

export default router;
