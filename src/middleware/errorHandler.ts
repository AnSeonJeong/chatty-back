import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import { BadRequest } from "../errors/BadRequest";
import { InternalServerError } from "../errors/InternalServerError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("에러 발생:", error);

  if (
    error instanceof CustomError ||
    error instanceof BadRequest ||
    error instanceof InternalServerError
  ) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    res.status(500).json({ error: "서버 에러 발생" });
  }
};
