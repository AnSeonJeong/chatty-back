import jwt from "jsonwebtoken";

export class GenerateJwtUtil {
  private id: number;
  private nickname: string;

  constructor(id: number, nickname: string) {
    this.id = id;
    this.nickname = nickname;
  }

  public generateToken(secretKey: string, expiresIn: string) {
    const payload = {
      id: this.id,
      nickname: this.nickname,
      //   exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
    return token;
  }
}
