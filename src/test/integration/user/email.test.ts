import { expect } from "chai";
import sinon from "sinon";
import { EmailService } from "@core/email/email.service";

describe("Teste de email", () => {
  let emailService: EmailService;
  let stub: sinon.SinonStub;

  beforeEach(() => {
    emailService = new EmailService();
    stub = sinon.stub(emailService, "sendEmail");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Deve enviar um email com sucesso", async () => {
    stub.resolves({ message: "Email enviado com sucesso!" });

    const result = await emailService.sendEmail({
      from: "no-reply@guina.dev",
      to: "user@example.com",
      subject: "Teste",
      text: "Corpo do e-mail",
    });

    expect(result.message).to.equal("Email enviado com sucesso!");
    expect(stub.calledOnce).to.be.equal(true);
    expect(
      stub.calledWithMatch({
        from: "no-reply@guina.dev",
        to: "user@example.com",
        subject: "Teste",
        text: "Corpo do e-mail",
      }),
    ).to.be.equal(true);
  });

  it("Deve lançar um erro se o email não for enviado", async () => {
    stub.resolves({
      status: "Erro",
      message: "Email não enviado!",
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
