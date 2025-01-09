export class CustomError extends Error {
  code: number;
  additionalInfo?: string;

  constructor({
    code,
    message,
    additionalInfo,
  }: {
    code: number;
    message: string;
    additionalInfo?: string;
  }) {
    super(message);
    this.name = "CustomError";
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}
