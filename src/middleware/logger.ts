import morgan from "morgan";
import { Router } from "express";

const router = Router();

if (process.env.NODE_ENV === "production") {
  router.use(morgan("combined")); // 배포환경일 경우
} else {
  router.use(morgan("dev")); // 개발환경일 경우
}

export default router;
