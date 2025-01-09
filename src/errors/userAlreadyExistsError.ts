import { CustomError } from "./customError.js";

export class UserAlreadyExists extends CustomError {
  constructor({
    message,
    additionalInfo,
  }: {
    message: string;
    additionalInfo?: string;
  }) {
    super({
      code: 409,
      message,
      additionalInfo,
    });
    this.name = "UserAlreadyExists";
  }
}
