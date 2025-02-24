import { CustomError } from "./custom.error";

export class EmailNotSend extends CustomError {
  constructor({
    message,
    additionalInfo,
  }: {
    message: string;
    additionalInfo?: string;
  }) {
    super({
      code: 500,
      message,
      additionalInfo,
    });
    this.name = "EmailNotSend";
  }
}
