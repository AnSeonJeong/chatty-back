import { NextFunction, Request, Response } from "express";
import { FriendService } from "../services/FriendService";
import { HttpCode } from "../errors/HttpCode";

export class FriendController {
  private friendService: FriendService;

  constructor() {
    this.friendService = new FriendService();
  }

  public getAllFriends = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const friends = await this.friendService.getAllFriends(parseInt(id));

    res.status(HttpCode.OK).json(friends);
  };
}
