import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { HttpCode } from "../errors/HttpCode";
import dotenv from "dotenv";
import { GenerateTokenUtil } from "../utils/GenerateTokenUtil";

dotenv.config();

interface MyToken extends JwtPayload {
  id: number;
  nickname: string;
}

const { SECRET_KEY } = process.env;

export const tokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const refreshToken = req.cookies.refreshTkn;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.slice(7); // "Bearer " 부분을 제외한 나머지 문자열을 추출

    try {
      const decodedToken = jwt.verify(token, SECRET_KEY);
      req.decoded = decodedToken; // 토큰의 복호화된 데이터 저장
      next(); // 다음 미들웨어로 이동
    } catch (error) {
      console.log(error);
      // access token 검증이 실패할 경우, refresh token 검증
      validateRefreshToken(req, next, refreshToken);
    }
  } else if (!authorizationHeader && refreshToken) {
    validateRefreshToken(req, next, refreshToken);
  } else {
    throw new CustomError("토큰이 존재하지 않습니다.", HttpCode.NOT_FOUND);
  }
};

const validateRefreshToken = (
  req: Request,
  next: NextFunction,
  refreshToken: string
) => {
  const decoded = jwt.verify(refreshToken, SECRET_KEY) as MyToken;
  if (decoded) {
    // 토큰 검증 성공
    const { id, nickname } = decoded;
    const generateTokenUtil = new GenerateTokenUtil(SECRET_KEY);
    const newToken = generateTokenUtil.generateToken(id, nickname, "2h");
    req.headers.authorization = `Bearer ${newToken}`; // 새로 발급된 토큰으로 Authorization 헤더 업데이트
    next();
  } else {
    throw new CustomError("유효하지 않은 토큰입니다.", HttpCode.UNAUTHORIZED);
  }
};
