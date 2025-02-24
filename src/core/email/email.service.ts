import { Resend } from "resend";
import { Service } from "typedi";

interface Response {
  status?: string;
  message: string;
}

@Service()
export class EmailService {
  private resendClient: Resend;

  constructor() {
    this.resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail( { from, to, subject, text, html }: { from: string; to: string; subject: string; text: string; html?: string; }): Promise<Response> {
    const { error } = await this.resendClient.emails.send({
      from,
      to,
      subject,
      text,
      html,
    })
    if (error) {
      console.log(error)
      const errorResponse = {
        status: "Erro",
        message: "Email não enviado!",
      }
      return errorResponse;
    }
    const data = {
      status: "Sucesso",
      message: "Email enviado com sucesso!",
    }
    return data;
  }
}
