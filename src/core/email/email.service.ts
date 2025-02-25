import { Resend } from "resend";
import { Service } from "typedi";

interface Response {
  status: "Sucesso" | "Erro";
  message: string;
  additionalInfo?: string;
}

@Service()
export class EmailService {
  private resendClient: Resend;

  constructor() {
    this.resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail({
    from,
    to,
    subject,
    text,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<Response> {
    const { error } = await this.resendClient.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      const errorResponse: Response = {
        status: "Erro",
        message: "Email não enviado!",
        additionalInfo: error.message,
      };
      return errorResponse;
    }
    const data: Response = {
      status: "Sucesso",
      message: "Email enviado com sucesso!",
    };

    return data;
  }
}
