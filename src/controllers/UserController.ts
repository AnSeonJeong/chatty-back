import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { HttpCode } from "../errors/HttpCode";
import { FriendService } from "../services/FriendService";

export class UserController {
  private userService: UserService;
  private friendService: FriendService;

  constructor() {
    this.userService = new UserService();
    this.friendService = new FriendService();
  }

  public addUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    let newUser: any;
    const userData = req.body;
    newUser = await this.userService.addUser(userData);

    res.status(HttpCode.OK).json(newUser);
  };

  public saveProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    let updatedUser: any;

    const profile = req.file?.filename;
    const id = req.query.id as string;

    if (profile && id) {
      updatedUser = await this.userService.saveProfileImage(
        profile,
        parseInt(id)
      );
    }
    return updatedUser;
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { email, pwd } = req.body;
    const login = await this.userService.login(email, pwd);
    const getToken = await this.userService.generateToken(login);

    this.setRefreshTokenCookie(res, getToken.refresh_token);

    res.status(HttpCode.OK).json(getToken.access_token);
  };

  public getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const userId = req.params.userId || id;

    const user = await this.userService.getUser(userId);
    let isFriend = false;
    if (userId) {
      isFriend = await this.friendService.isFriend(id, userId);
    }

    const imagePath = `/uploads/user-profiles/${user.profile}`;
    const imageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;

    res
      .status(HttpCode.OK)
      .json({ ...user.dataValues, profileUrl: imageUrl, isFriend });
  };

  public searchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const nickname = req.params.nickname;
    const users = await this.userService.searchUser(id, nickname);

    const profileUrls = users.map((f) => {
      const imagePath = `/uploads/user-profiles/${f.profile}`;
      return `${req.protocol}://${req.get("host")}${imagePath}`;
    });

    const usersWithProfileUrls = users.map((user, index) => {
      return {
        ...user.dataValues,
        profileUrl: profileUrls[index],
      };
    });
    console.log(usersWithProfileUrls);

    res.status(HttpCode.OK).json(usersWithProfileUrls);
  };

  public updateUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const { password, nickname, intro } = req.body;
    const userInfo = {
      id: id,
      password: password,
      nickname: nickname,
      intro: intro,
    };

    const isUpdated = await this.userService.updateUserInfo(userInfo);

    res.status(HttpCode.OK).json(isUpdated);
  };

  public updateProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const prevProfile = req.query.profile as string;
    const newProfile = req.file?.filename;

    let updatedUser: any;
    let isDeleted = false;

    if (newProfile && id) {
      // 이미지 업데이트
      updatedUser = await this.userService.saveProfileImage(newProfile, id);

      // 이전 이미지가 존재하면 삭제
      if (prevProfile)
        isDeleted = await this.userService.deleteProfileImage(prevProfile);
      else isDeleted = true;
    }

    res.status(HttpCode.OK).json(updatedUser && isDeleted ? true : false);
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.params;
    const isDeleted = await this.userService.deleteUser(parseInt(id));
    let isSuccess = false;

    if (isDeleted) {
      // 발급받은 리프레시 토큰 쿠키에서 삭제
      res.clearCookie("refreshTkn", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      isSuccess = true;
    }

    res.status(HttpCode.OK).json(isSuccess);
  };

  public socialConnection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const type = req.params.social;
    const authorizationUrl = await this.userService.socialConnection(type);

    res.status(HttpCode.OK).json(authorizationUrl);
  };

  public socialLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { code, type, state } = req.query as {
      code: string;
      type: string;
      state: string;
    };

    const token = await this.userService.getAccessToken(code, type, state);
    const userInfo = await this.userService.getUserInfo(token, type);
    const serviceToken = await this.userService.generateToken(userInfo);

    this.setRefreshTokenCookie(res, serviceToken.refresh_token);

    res.status(HttpCode.OK).json(serviceToken.access_token);
  };

  private setRefreshTokenCookie = (
    res: Response,
    refreshToken: string
  ): void => {
    res.cookie("refreshTkn", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  };
}
