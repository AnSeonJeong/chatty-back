import jwt from "jsonwebtoken";

export class TokenUtil {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  // 토큰 생성
  public generateToken(id: number, nickname: string, expiresIn: string) {
    const payload = {
      id: id,
      nickname: nickname,
    };

    const token = jwt.sign(payload, this.secretKey, { expiresIn: expiresIn });
    return token;
  }

  // 토큰 검증
  public validateToken(token: string) {
    let isValid: boolean;
    try {
      // 토큰이 유효한 경우
      jwt.verify(token, this.secretKey);
      isValid = true;
    } catch (error) {
      // 토큰이 유효하지 않은 경우
      isValid = false;
    }
    return isValid;
  }
}
