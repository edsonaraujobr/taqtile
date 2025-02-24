import { EmailNotSend } from "@domain/errors";
import { Resend } from "resend";
import { Service } from "typedi";

@Service()
export class EmailService {
  private resendClient: Resend;

  constructor() {
    this.resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail( { from, to, subject, text, html }: { from: string; to: string; subject: string; text: string; html?: string; }): Promise<String> {
    const { error } = await this.resendClient.emails.send({
      from,
      to,
      subject,
      text,
      html,
    })
    if (error) {
      throw new EmailNotSend({
        message: "Email não enviado",
        additionalInfo: error.message,
      })
    }
    return "Email enviado com sucesso!";
  }
}
