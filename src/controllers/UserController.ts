import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { HttpCode } from "../errors/HttpCode";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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
    console.log(profile, parseInt(id));
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
    console.log(userId);
    const user = await this.userService.getUser(userId);
    const imagePath = `/uploads/user-profiles/${user.profile}`;
    const imageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;

    res.status(HttpCode.OK).json({ ...user, profileUrl: imageUrl });
  };

  public searchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const nickname = req.params.nickname;
    const users = await this.userService.searchUser(nickname);

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

  public socialConnection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { type } = req.query as { type: string };
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
