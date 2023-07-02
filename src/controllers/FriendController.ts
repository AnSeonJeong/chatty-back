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

    const profileUrls = friends.map((f) => {
      const imagePath = `/uploads/user-profiles/${f.profile}`;
      return `${req.protocol}://${req.get("host")}${imagePath}`;
    });

    const friendsWithProfileUrls = friends.map((friend, index) => {
      return {
        ...friend.dataValues,
        profileUrl: profileUrls[index],
      };
    });
    console.log(friendsWithProfileUrls);

    res.status(HttpCode.OK).json(friendsWithProfileUrls);
  };
}
