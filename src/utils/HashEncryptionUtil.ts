import bcrypt from "bcrypt";
import { BadRequest } from "../errors/BadRequest";
import { InternalServerError } from "../errors/InternalServerError";

export class HashEncryptionUtil {
  // 비밀번호 암호화
  public static encryptPassword = async (
    password: string,
    saltRounds: number
  ) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds); // salt
      const hashedPwd = await bcrypt.hash(password, salt); // hash function
      return hashedPwd;
    } catch (error) {
      console.log(error);
      throw new InternalServerError("비밀번호 암호화 실패");
    }
  };

  // 비밀번호 확인
  public static comparePassword = async (
    password: string,
    hashedPwd: string
  ) => {
    try {
      const match = await bcrypt.compare(password, hashedPwd);
      return match;
    } catch (error) {
      console.log(error);
      throw new BadRequest("비밀번호 확인에 실패했습니다.");
    }
  };
}
