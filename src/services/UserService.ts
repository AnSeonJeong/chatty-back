import { User } from "../db/models/userModel";

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
        throw new Error("필수 입력 값이 비었습니다.");
      }

      // 이메일 중복 체크
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new Error("이미 등록된 이메일입니다.");

      // 회원 데이터 저장
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      console.error("회원가입 실패❌: ", error);
      throw new Error("회원가입에 실패하였습니다.");
    }
  };
}
