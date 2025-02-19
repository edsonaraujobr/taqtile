import { CustomError } from "./custom.error";

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
