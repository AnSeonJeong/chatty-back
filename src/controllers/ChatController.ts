import { NextFunction, Request, Response } from "express";
import { ChatService } from "../services/ChatService";
import { HttpCode } from "../errors/HttpCode";

export class ChatController {
  private chatService;

  constructor() {
    this.chatService = new ChatService();
  }

  public getChatrooms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const chatroomList = await this.chatService.getChatrooms(id);
    console.log("chatroomList=", chatroomList);

    res.status(HttpCode.OK).json(chatroomList);
  };
}
