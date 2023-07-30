import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { wrapAsync } from "../utils/wrapAsyncUtil";
import upload from "../config/upload_config";
import { tokenValidator } from "../middleware/tokenValidator";

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
router.get("/login/:social", wrapAsync(userController.socialConnection));
router.get("/redirect", wrapAsync(userController.socialLogin));

// 발급받은 토큰 검증
router.use(tokenValidator);
// 사용자 정보 불러오기
router.get("/main", wrapAsync(userController.getUser));
router.get("/users/:userId", wrapAsync(userController.getUser));
router.get("/users/search/:nickname", wrapAsync(userController.searchUser));

// 회원 정보 수정
router.post(
  "/profile/update",
  upload.single("update_info"),
  wrapAsync(userController.updateUserInfo)
);

// 회원 프로필 이미지 수정
router.post(
  "/profile/update/image",
  upload.single("profile"),
  wrapAsync(userController.updateProfileImage)
);

// 로그아웃

export default router;
