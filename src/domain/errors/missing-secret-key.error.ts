import { CustomError } from "./custom.error";

export class MissingSecretKeyError extends CustomError {
  constructor({
    message = "SECRET_KEY não está definido no arquivo .env",
    additionalInfo,
  }: {
    message?: string;
    additionalInfo?: string;
  } = {}) {
    super({
      code: 500,
      message,
      additionalInfo,
    });
    this.name = "MissingSecretKeyError";
  }
}
