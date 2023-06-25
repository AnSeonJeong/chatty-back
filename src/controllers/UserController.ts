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
    const userData = req.body;
    const newUser = await this.userService.addUser(userData);

    res
      .status(HttpCode.OK)
      .json({ user: newUser, message: "성공적으로 등록되었습니다✔️" });
  };

  public socialConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { type } = req.query as { type: string };
    const config = await this.userService.socialConnection(type);

    res.status(HttpCode.OK).json(config);
  };

  public socialLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { code, type } = req.query as { code: string; type: string };
    let userToken;
    if (req.headers.authorization)
      userToken = req.headers.authorization.split("Bearer ")[1];

    const token = await this.userService.getAccessToken(code);
    const userInfo = await this.userService.getUserInfo(token, type);
    const serviceToken = await this.userService.generateToken(
      userToken,
      userInfo
    );

    res.status(HttpCode.OK).json(serviceToken);
  };
}
