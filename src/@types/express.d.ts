declare namespace Express {
  export interface Request {
    decoded: string | import("jsonwebtoken").JwtPayload;
  }
}
