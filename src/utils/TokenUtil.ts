import jwt from "jsonwebtoken";

export class TokenUtil {
  private id: number;
  private nickname: string;

  constructor(id: number, nickname: string) {
    this.id = id;
    this.nickname = nickname;
  }

  // 토큰 생성
  public generateToken(secretKey: string, expiresIn: string) {
    const payload = {
      id: this.id,
      nickname: this.nickname,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
    return token;
  }

  // 토큰 검증
  public validateToken(token: string, secretKey: string) {
    let isValid: boolean;
    try {
      // 토큰이 유효한 경우
      jwt.verify(token, secretKey);
      isValid = true;
    } catch (error) {
      // 토큰이 유효하지 않은 경우
      isValid = false;
    }
    return isValid;
  }
}
