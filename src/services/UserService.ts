import axios from "axios";
import { User } from "../db/models/userModel";
import { BadRequest } from "../errors/BadRequest";
import { CustomError } from "../errors/CustomError";
import { InternalServerError } from "../errors/InternalServerError";
import { HashEncryptionUtil } from "../utils/HashEncryptionUtil";
import dotenv from "dotenv";
import { TokenUtil } from "../utils/TokenUtil";
import { RandomStringUtil } from "../utils/RandomStringUtil";

dotenv.config(); // .env 파일의 환경 변수를 로드
const {
  KAKAO_REST_API_KEY,
  KAKAO_REDIRECT_URI,
  SECRET_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,
} = process.env;

export class UserService {
  // 회원가입
  public addUser = async (userData: any) => {
    const social_id = userData.social_id;
    const email = userData.email;
    const pwd = userData.password;
    const nickname = userData.nickname;

    try {
      let newUser: User;

      if (social_id) {
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

  // 소셜 로그인 : 카카오, 구글, 네이버
  // 1. 소셜 로그인 인가코드 받기
  public socialConnection = async (type: string) => {
    try {
      let authorizationUrl: string | undefined;

      if (type === "kakao") {
        authorizationUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
      } else if (type === "google") {
        authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
      } else if (type === "naver") {
        const STATE = RandomStringUtil.generateRandomString(10);
        authorizationUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;
      }

      return authorizationUrl;
    } catch (err) {
      console.log(err);
      throw new InternalServerError(`${type}-login : 연결 실패`);
    }
  };

  // 2. 인가코드를 이용하여 토큰 발급
  public getAccessToken = async (code: string, type: string, state: string) => {
    try {
      let api_url = "";
      let data: any;
      let header = {
        "Content-Type": "application/x-www-form-urlencoded",
      };

      if (type === "kakao") {
        api_url = "https://kauth.kakao.com/oauth/token";

        data = {
          grant_type: "authorization_code",
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: KAKAO_REDIRECT_URI,
          code: code,
        };
      } else if (type === "google") {
        api_url = "https://oauth2.googleapis.com/token";

        data = {
          grant_type: "authorization_code",
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          code: code,
        };
      } else if (type === "naver") {
        api_url = "https://nid.naver.com/oauth2.0/token";

        data = {
          grant_type: "authorization_code",
          client_id: NAVER_CLIENT_ID,
          client_secret: NAVER_CLIENT_SECRET,
          redirect_uri: NAVER_REDIRECT_URI,
          code: code,
          state: state,
        };

        interface CustomHeaders {
          "Content-Type": string;
          "X-Naver-Client-Id"?: string;
          "X-Naver-Client-Secret"?: string;
        }

        header = {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Naver-Client-Id": NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        } as CustomHeaders;
      }

      // 2-1. 엑세스 토큰 발급
      const response = await axios.post(api_url, data, { headers: header });

      const ACCESS_TOKEN = response.data.access_token;

      // 2-2. 카카오 로그인인 경우, 이메일 정보가 없을 시 회원가입 불가
      if (
        type === "kakao" &&
        (!response.data.scope || !response.data.scope.includes("account_email"))
      ) {
        return;
      }

      return ACCESS_TOKEN;
    } catch (err) {
      console.log(err);
      throw new InternalServerError(`${type}-login : 토큰 발급 실패`);
    }
  };

  // 3. 사용자 정보 취득
  public getUserInfo = async (token: string, type: string) => {
    try {
      // 3-1. 토큰을 이용하여 소셜 회원 정보 취득 후
      let api_url = "";
      let userData: any;

      if (type === "kakao") api_url = "https://kapi.kakao.com/v2/user/me";
      else if (type === "google")
        api_url = "https://www.googleapis.com/userinfo/v2/me";
      else if (type === "naver")
        api_url = "https://openapi.naver.com/v1/nid/me";

      const res = await axios.get(api_url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newUserData = (
        id: string,
        nickname: string,
        email: string,
        type: string
      ) => {
        const userData = {
          social_id: id,
          nickname: nickname,
          email: email,
          type: type,
        };

        return userData;
      };

      if (type === "kakao" && res.data) {
        const data = res.data;
        userData = newUserData(
          data.id,
          data.profile.nickname,
          data.email,
          type
        );
      } else if (type === "google" && res.data) {
        const data = res.data;
        userData = newUserData(data.id, data.name, data.email, type);
      } else if (type === "naver" && res.data) {
        const data = res.data.response;
        userData = newUserData(data.id, data.nickname, data.email, type);
      }

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
      throw new InternalServerError(`${type}-login : 사용자 정보 취득 실패`);
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
      throw new InternalServerError(
        `${userInfo.type}-login : 서비스 전용 토큰 발급 실패`
      );
    }
  };
}
