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
}
