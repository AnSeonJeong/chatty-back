import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const wrapAsync = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 모든 오류를 .catch() 처리 후 next() 미들웨어에 전달
    fn(req, res, next).catch(next);
  };
};
