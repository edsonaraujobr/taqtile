import { expect } from "chai";
import sinon from "sinon";
import { EmailService } from "@core/email/email.service";

describe("Teste de email", () => {
  let emailService: EmailService;
  let resendMock: { emails: { send: sinon.SinonStub } };

  beforeEach(() => {
    resendMock = {
      emails: {
        send: sinon.stub(),
      },
    };

    emailService = new EmailService();

    (emailService as any).resendClient = resendMock;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Deve enviar um email com sucesso", async () => {
    (resendMock.emails.send as sinon.SinonStub).resolves({
      id: "123",
      error: null,
    });

    const result = await emailService.sendEmail({
      from: "no-reply@guina.dev",
      to: "user@example.com",
      subject: "Teste",
      text: "Corpo do e-mail",
    });

    expect(result.message).to.equal("Email enviado com sucesso!");
    expect(resendMock.emails.send.calledOnce).to.be.equal(true);
    expect(
      resendMock.emails.send.calledWithMatch({
        from: "no-reply@guina.dev",
        to: "user@example.com",
        subject: "Teste",
        text: "Corpo do e-mail",
      }),
    ).to.be.equal(true);
  });

  it("Deve lançar um erro se o email não for enviado", async () => {
    (resendMock.emails.send as sinon.SinonStub).resolves({
      id: null,
      error: "Falha no envio",
    });

    const response = await emailService.sendEmail({
      from: "no-reply@guina.dev",
      to: "user@example.com",
      subject: "Teste",
      text: "Corpo do e-mail",
    });

    expect(response.status).to.equal("Erro");
    expect(response.message).to.equal("Email não enviado!");
  });
});
