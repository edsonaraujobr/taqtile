import { CustomError } from "./custom.error";

export class UserAlreadyExistsError extends CustomError {
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
    this.name = "UserAlreadyExistsError";
  }
}
