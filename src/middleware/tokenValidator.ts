import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { HttpCode } from "../errors/HttpCode";

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
      req.body.decoded = decodedToken; // 토큰의 복호화된 데이터 저장
      next(); // 다음 미들웨어로 이동
    } catch (error) {
      console.log(error);
      throw new CustomError("Invalid token", HttpCode.UNAUTHORIZED);
    }
  } else {
    throw new CustomError("Invalid token", HttpCode.UNAUTHORIZED);
  }
};
