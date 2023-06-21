import bcrypt from "bcrypt";
import { BadRequest } from "../errors/BadRequest";
import { InternalServerError } from "../errors/InternalServerError";

export class HashEncryptionUtil {
  private saltRounds: number;

  constructor(saltRounds: number) {
    this.saltRounds = saltRounds;
  }

  // 비밀번호 암호화
  public encryptPassword = async (password: string) => {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds); // salt
      const hashedPwd = await bcrypt.hash(password, salt); // hash function
      console.log(`salt= ${salt}, pwd= ${hashedPwd}`);
      return hashedPwd;
    } catch (error) {
      console.log(error);
      throw new InternalServerError("비밀번호 암호화 실패");
    }
  };

  // 비밀번호 확인
  public comparePassword = async (password: string, hashedPwd: string) => {
    try {
      const match = await bcrypt.compare(password, hashedPwd);
      if (match === true) return match;
    } catch (error) {
      console.log(error);
      throw new BadRequest("비밀번호 확인에 실패했습니다.");
    }
  };
}
