import { CustomError } from "./custom.error.js";

export class MissingCredentialsAdminError extends CustomError {
  constructor({
    message = "Faltando variáveis de ambiente: NAME_ADMIN, EMAIL_ADMIN ou PASSWORD_ADMIN",
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
    this.name = "MissingCredentialsAdminError";
  }
}
