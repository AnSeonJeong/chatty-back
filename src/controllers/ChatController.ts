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
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const room_id = parseInt(req.params.room_id);
    const chatList = await this.chatService.getChatList(room_id, id);

    res.status(HttpCode.OK).json(chatList);
  };

  public createChatroomWithMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const { memberIds, nicknames } = req.body;
    memberIds.push(id);

    const roomId = await this.chatService.createChatroomWithMembers(
      memberIds,
      nicknames
    );

    res.status(HttpCode.OK).json(roomId);
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

    res.status(HttpCode.OK).json(!!chatting);
  };

  public getChatroomMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const memberId = parseInt(req.params.mem_id);

    const roomId = await this.chatService.getChatroomMember(id, memberId);

    res.status(HttpCode.OK).json(roomId);
  };

  public saveChatImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const room_id = parseInt(req.params.room_id);
    const chatImage = req.file?.filename;

    const chatting = await this.chatService.saveChatting({
      image: chatImage,
      room_id: room_id,
      sender_id: id,
    });

    res.status(HttpCode.OK).json(chatting.image);
  };

  public saveChatDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const room_id = parseInt(req.params.room_id);
    const chatDocument = req.file?.filename;
    const originalName = req.file?.originalname;

    const chatting = await this.chatService.saveChatting({
      document: chatDocument,
      originalDocName: originalName,
      room_id: room_id,
      sender_id: id,
    });

    const { document, originalDocName } = chatting;

    res
      .status(HttpCode.OK)
      .json({ document: document, originalDocName: originalDocName });
  };

  public saveOrUpdateNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { roomId, userId, notiCnt } = req.body;
    console.log(req.body);
    const saveOrUpdateNoti = await this.chatService.saveOrUpdateNotification(
      roomId,
      userId,
      notiCnt
    );

    res.status(HttpCode.OK).json(saveOrUpdateNoti);
  };

  public exitChatroom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const room_id = req.params.room_id;

    const exitChatroom = await this.chatService.exitChatroom(
      parseInt(room_id),
      id
    );

    res.status(HttpCode.OK).json(exitChatroom);
  };

  public searchChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { id } = req.decoded as import("jsonwebtoken").JwtPayload;
    const nickname = req.params.nickname;

    const result = await this.chatService.searchChats(id, nickname);
    console.log("result=", result);

    res.status(HttpCode.OK).json(result);
  };
}
