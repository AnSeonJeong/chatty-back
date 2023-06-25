import axios from "axios";
import { User } from "../db/models/userModel";
import { BadRequest } from "../errors/BadRequest";
import { CustomError } from "../errors/CustomError";
import { InternalServerError } from "../errors/InternalServerError";
import { HashEncryptionUtil } from "../utils/HashEncryptionUtil";
import dotenv from "dotenv";
import { TokenUtil } from "../utils/TokenUtil";

dotenv.config(); // .env 파일의 환경 변수를 로드
const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI, SECRET_KEY } = process.env;

export class UserService {
  // 회원가입
  public addUser = async (userData: any) => {
    const social_id = userData.social_id;
    const email = userData.email;
    const pwd = userData.password;
    const nickname = userData.nickname;

    try {
      let newUser: User;

      if (!social_id) {
        // 소셜 회원가입일 경우
        newUser = await User.create(userData);
      } else {
        // 일반 회원가입일 경우
        if (!email || !pwd || !nickname) {
          throw new BadRequest("필수 입력 값이 비었습니다");
        }

        // 회원 조회
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new CustomError("이미 등록된 회원입니다.", 409);

        // 비밀번호 암호화
        const hashEncryptionUtil = new HashEncryptionUtil(10);
        const hashedPwd = hashEncryptionUtil.encryptPassword(pwd);

        // 회원 데이터 저장
        newUser = await User.create({ ...userData, password: hashedPwd });
      }
      return newUser;
    } catch (error) {
      console.error(error);
      throw new InternalServerError("회원가입에 실패하였습니다.");
    }
  };

  // 소셜 로그인
  // 1. 소셜 로그인 인가코드 받기
  public socialConnection = async (type: string) => {
    if (type === "kakao") {
      const authorizationUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
      return authorizationUrl;
    }

    throw new InternalServerError("소셜 로그인 연결 실패");
  };

  // 2. 인가코드를 이용하여 토큰 발급
  public getAccessToken = async (code: string) => {
    try {
      const data = {
        grant_type: "authorization_code",
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
      };

      // 2-1. 엑세스 토큰 발급
      const response = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        data
      );

      const ACCESS_TOKEN = response.data.access_token;
      const SCOPE: string = response.data.scope;

      // 2-2. 이메일 정보가 없을 시 회원가입 불가
      if (!SCOPE.includes("account_email")) {
        return;
      }

      return ACCESS_TOKEN;
    } catch (err) {
      throw new InternalServerError("kakao-login : 토큰 발급 실패");
    }
  };

  // 3. 사용자 정보 취득
  public getUserInfo = async (token: string, type: string) => {
    // 3-1. 토큰을 이용하여 소셜 회원 정보 취득 후
    try {
      const res = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const account = res.data.kakao_account;
      const userData = {
        social_id: res.data.id,
        nickname: account.profile.nickname,
        email: account.email,
      };

      // 3-2. 가입여부 확인
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

      // 3-3. 가입되지 않은 사용자일 경우, 회원가입
      if (existingUser === null) await this.addUser(userData);

      // 3-4. 회원 조회하여 id, nickname 취즉
      const user = await User.findAll({ attributes: ["email", "social_id"] });

      const userInfo = {
        id: user[0].dataValues.id,
        nickname: user[0].dataValues.nickname,
        type: type,
      };

      return userInfo;
    } catch (err) {
      throw new InternalServerError("kakao-login : 사용자 정보 취득 실패");
    }
  };

  // 4. 서비스 전용 토큰 발급
  public generateToken = async (userInfo: any) => {
    try {
      const tokenUtil = new TokenUtil(userInfo.id, userInfo.nickname);

      const newToken = (expiresIn: string) => {
        const token = tokenUtil.generateToken(SECRET_KEY!, expiresIn);
        return token;
      };

      const serviceToken = newToken("2h");

      return serviceToken;
    } catch (err) {
      console.log(err);
      throw new InternalServerError("kakao-login : 서비스 전용 토큰 발급 실패");
    }
  };
}
