import { EmailService } from "@core/email/email.service";
import { userData } from "@test/utils/user.data-utils"
import { expect } from "chai";

describe("Teste de email", () => {
  const { emailFull, emailWithoutHTML } = userData;

  it("Deve enviar um email com HTML com sucesso!", async () => {
    const emailService: EmailService = new EmailService();
    const response = await emailService.sendEmail(emailFull);

    expect(response.status).to.equal("Sucesso!")
    expect(response.message).to.equal("Email enviado com sucesso!")
  })

  it("Deve enviar um email sem HTML com sucesso!", async () => {
    const emailService: EmailService = new EmailService();
    const response = await emailService.sendEmail(emailWithoutHTML);

    expect(response.status).to.equal("Sucesso!")
    expect(response.message).to.equal("Email enviado com sucesso!")
  })

})
