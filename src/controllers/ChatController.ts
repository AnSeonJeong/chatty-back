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

    res.status(HttpCode.OK).json(chatroomList);
  };

  public getChatList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const room_id = parseInt(req.params.room_id);
    const chatList = await this.chatService.getChatList(room_id);

    res.status(HttpCode.OK).json(chatList);
  };

  public saveChatting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const room_id = parseInt(req.params.room_id);
    const chatData = req.body;

    const chatting = await this.chatService.saveChatting({
      ...chatData,
      room_id: room_id,
      sender_id: id,
    });

    res.status(HttpCode.OK).json(chatting);
  };
}
