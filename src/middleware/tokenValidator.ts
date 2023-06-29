import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { HttpCode } from "../errors/HttpCode";
import dotenv from "dotenv";

dotenv.config();

export const tokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.slice(7); // "Bearer " 부분을 제외한 나머지 문자열을 추출

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY!);
      req.decoded = decodedToken; // 토큰의 복호화된 데이터 저장
      next(); // 다음 미들웨어로 이동
    } catch (error) {
      console.log(error);
      throw new CustomError("유효하지 않은 토큰입니다.", HttpCode.UNAUTHORIZED);
    }
  } else {
    throw new CustomError("토큰이 존재하지 않습니다.", HttpCode.NOT_FOUND);
  }
};
