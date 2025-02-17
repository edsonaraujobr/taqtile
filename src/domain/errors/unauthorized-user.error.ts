import { CustomError } from "./custom.error.js";

export class UnauthorizedUser extends CustomError {
  constructor({
    message,
    additionalInfo,
  }: {
    message: string;
    additionalInfo?: string;
  }) {
    super({
      code: 401,
      message,
      additionalInfo,
    });
    this.name = "UnauthorizedUser";
  }
}
