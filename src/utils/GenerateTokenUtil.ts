import jwt from "jsonwebtoken";

export class GenerateTokenUtil {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  public generateToken(id: number, nickname: string, expiresIn: string) {
    const payload = {
      id: id,
      nickname: nickname,
    };

    const token = jwt.sign(payload, this.secretKey, { expiresIn: expiresIn });
    return token;
  }
}
