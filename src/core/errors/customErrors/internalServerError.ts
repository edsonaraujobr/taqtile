import { CustomError } from "./customError.js";

export class InternalServerError extends CustomError {
  constructor({
    message = "Erro interno no servidor",
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
    this.name = "InternalServerError";
  }
}
