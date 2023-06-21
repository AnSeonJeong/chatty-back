import { HttpCode } from "./HttpCode";
import { CustomError } from "./CustomError";

export class BadRequest extends CustomError {
  constructor(message: string) {
    super(message, HttpCode.BAD_REQUEST);
  }
}
