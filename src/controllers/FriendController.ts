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
    const isFriendsRoute = req.originalUrl === "/friends";

    const friends = await this.friendService.getAllFriends(
      parseInt(id),
      isFriendsRoute
    );

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

    res.status(HttpCode.OK).json(friendsWithProfileUrls);
  };

  public addFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const friendId = parseInt(req.params.friend_id);

    const isAdded = await this.friendService.addFriend(id, friendId);

    res.status(HttpCode.OK).json(isAdded);
  };

  public removeFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const friendId = parseInt(req.params.friend_id);

    const isRemoved = await this.friendService.removeFriend(id, friendId);

    res.status(HttpCode.OK).json(isRemoved);
  };
}
