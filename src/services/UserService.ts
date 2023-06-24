import axios from "axios";
import { User } from "../db/models/userModel";
import { BadRequest } from "../errors/BadRequest";
import { CustomError } from "../errors/CustomError";
import { HttpCode } from "../errors/HttpCode";
import { InternalServerError } from "../errors/InternalServerError";
import { HashEncryptionUtil } from "../utils/HashEncryptionUtil";
import dotenv from "dotenv";
BadRequest;
import { GenerateJwtUtil } from "../utils/GenerateJwtUtil";
import sequelize from "../db/models/sequelize";

dotenv.config(); // .env 파일의 환경 변수를 로드
const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI, SECRET_KEY } = process.env;

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

  // 소셜 로그인
  // 1. client_id, redirect_uri 클라이언트에 전달
  public socialConfig = async (type: string) => {
    if (type === "kakao") {
      const key = KAKAO_REST_API_KEY;
      const uri = KAKAO_REDIRECT_URI;

      const config = { key: key, uri: uri };
      return config;
    }

    throw new InternalServerError("소셜 로그인 에러");
  };

  // 2. 인가코드를 이용하여 토큰 발급 및 사용자 정보 취득
  public socialLogin = async (code: string, type: string) => {
    const data = {
      grant_type: "authorization_code",
      client_id: KAKAO_REST_API_KEY,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };

    // 엑세스 토큰 발급
    const response = await axios
      .post("https://kauth.kakao.com/oauth/token", data, config)
      .catch((err) => {
        console.log(err);
        throw new BadRequest("엑세스 토큰 발급 실패");
      });

    const ACCESS_TOKEN = response.data.access_token;
    console.log("access_token=" + ACCESS_TOKEN);

    // 사용자 정보 취득
    const userInfo = await axios
      .get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequest("kakao-login : 사용자 정보 취득 실패");
      });

    console.log(userInfo.data);
    const account = userInfo.data.kakao_account;

    let social_id = userInfo.data.id;
    let nickname = account.profile.nickname;
    let email = account.email;

    // 가입 여부 확인
    const existingUser = await User.findOne({ where: { email: email } });

    // 가입되지 않은 사용자일 경우, 회원DB에 저장
    if (existingUser === null) {
      await User.create({
        social_id: social_id,
        nickname: nickname,
        email: email,
        type: type,
      }).catch((err) => {
        console.log(err);
        throw new InternalServerError("kakao-login : 회원 등록 실패");
      });
    }

    // 회원 id, nickname 취득
    const user = await User.findAll({
      attributes: ["email", "social_id"],
    }).catch((err) => {
      console.log(err);
      throw new InternalServerError("kakao-login : 회원 조회 실패");
    });

    // 회원 조회에 성공하면
    if (user) {
      const userId = user[0].dataValues.id;
      const nickname = user[0].dataValues.nickname;

      // 서비스 전용 토큰 발급
      const secretKey = SECRET_KEY;
      const expiresIn = "1h"; // 토큰 유효기간

      if (!secretKey) {
        throw new Error("SECRET_KEY 값이 없습니다.");
      }

      const generateToken = new GenerateJwtUtil(userId, nickname);
      const token = generateToken.generateToken(secretKey, expiresIn);
      console.log("token= " + token);

      // 클라이언트에 토큰 전달
      return token;
    } else {
      throw new BadRequest("kakao-login : 토큰 발급 실패");
    }
  };
}
