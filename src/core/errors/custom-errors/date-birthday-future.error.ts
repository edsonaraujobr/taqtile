import { CustomError } from "./custom.error.js";

export class DateBirthdayFutureError extends CustomError {
  constructor({
    message,
    additionalInfo,
  }: {
    message: string;
    additionalInfo?: string;
  }) {
    super({
      code: 422,
      message,
      additionalInfo,
    });
    this.name = "DateBirthdayFutureError";
  }
}
