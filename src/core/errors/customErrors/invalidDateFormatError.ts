import { CustomError } from "./customError.js";

export class InvalidDateFormatError extends CustomError {
  constructor({
    message,
    additionalInfo,
  }: {
    message: string;
    additionalInfo?: string;
  }) {
    super({
      code: 400,
      message,
      additionalInfo,
    });
    this.name = "InvalidDateFormatError";
  }
}
