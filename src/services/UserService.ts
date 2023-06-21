import { User } from "../db/models/userModel";
import { BadRequest } from "../errors/BadRequest";
import { CustomError } from "../errors/CustomError";
import { HttpCode } from "../errors/HttpCode";
import { InternalServerError } from "../errors/InternalServerError";
import { HashEncryptionUtil } from "../utils/HashEncryptionUtil";

export class UserService {
  // 회원 가입
  public addUser = async (userData: any): Promise<User> => {
    let email = userData.email;
    let pwd = userData.password;
    let name = userData.name;
    let birth = userData.birth;
    let phone = userData.phone;

    try {
      // 유효성 검사
      if (!email || !pwd || !name || !birth || !phone) {
        throw new BadRequest("필수 입력 값이 비었습니다.");
      }

      // 이메일 중복 체크
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new CustomError("이미 등록된 이메일입니다.", 409);

      // 비밀번호 암호화
      const hashEncryptionUtil = new HashEncryptionUtil(10);
      const hashedPwd = hashEncryptionUtil.encryptPassword(pwd);

      // 회원 데이터 저장
      const newUser = await User.create({ ...userData, password: hashedPwd });
      return newUser;
    } catch (error) {
      console.error("회원가입 실패❌: ", error);
      throw new InternalServerError("회원가입에 실패하였습니다.");
    }
  };
}
