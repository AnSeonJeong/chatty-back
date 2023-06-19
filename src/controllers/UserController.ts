import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public addUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const newUser = await this.userService.addUser(userData);
      res
        .status(200)
        .json({ user: newUser, message: "성공적으로 등록되었습니다✔️" });
    } catch (error) {
      console.error("등록 실패❌:", error);
      res.status(500).json({ error: "회원 등록 실패" });
    }
  };
}
