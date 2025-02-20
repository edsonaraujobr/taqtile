import { expect } from 'chai';
import axios from 'axios';
import { connectDB, clearDB } from "@test/helpers/db.helper";
import {
  createMutationLoginUserTest,
  createUserInDatabaseTest,
} from "@test/helpers/user.helper";
import { userData } from "@test/utils/user.data-utils";
import { isJwtPayload, JwtService } from "@core/jwt/jwt-service";

describe("User Mutation - Teste de Login", () => {
  const { validUser } = userData;

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve retornar erro no login pois o usuário não existe", async () => {
    const { mutation, variables } = createMutationLoginUserTest({
      email: "edson@gmail.com",
      password: "edson123",
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
      variables,
    });

    expect(response.data.errors[0].code).to.equal(404);
    expect(response.data.errors[0].message).to.equal(
      "Usuário não encontrado. Verifique seu email e senha",
    );
  });

  it("Deve criar o usuário no banco de dados e realizar login com sucesso", async () => {
    await createUserInDatabaseTest(validUser);

    const { mutation, variables } = createMutationLoginUserTest({
      email: validUser.email,
      password: validUser.password,
    });

    const responseLogin = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
      variables,
    });

    const token = responseLogin.data.data.loginUser.token;
    expect(token).to.be.a("string");
    expect(token.split(".")).to.have.length(3);

    const decodedToken = JwtService.decodeToken(token);
    expect(decodedToken).to.have.property("exp");

    const dateNowSeconds = Math.floor(Date.now() / 1000);
    const OneHourInSeconds = 60 * 60;
    if (isJwtPayload(decodedToken)) {
      expect(decodedToken.exp).to.be.closeTo(
        dateNowSeconds + OneHourInSeconds,
        10
      );
    }
    const loginUser = responseLogin.data.data.loginUser.user;
    expect(loginUser).to.have.property("id");
    expect(loginUser.name).to.equal(validUser.name);
    expect(loginUser.email).to.equal(validUser.email);
  });

  it("Deve retornar erro de senha incorreta", async () => {
    await createUserInDatabaseTest(validUser);

    const { mutation, variables } = createMutationLoginUserTest({
      email: validUser.email,
      password: "edson2025",
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
      variables,
    });
    expect(response.data.errors[0].code).to.equal(404);
    expect(response.data.errors[0].message).to.equal(
      "Usuário não encontrado. Verifique seu email e senha",
    );
  });

  it("Deve realizar login com remember-me ativado", async () => {
    await createUserInDatabaseTest(validUser);

    const { mutation, variables } = createMutationLoginUserTest({
      email: validUser.email,
      password: validUser.password,
      rememberMe: true,
    });

    const responseLogin = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
      variables,
    });

    const token = responseLogin.data.data.loginUser.token;
    expect(token).to.be.a("string");
    expect(token.split(".")).to.have.length(3);

    const decodedToken = JwtService.decodeToken(token);
    expect(decodedToken).to.have.property("exp");

    const dateNowSeconds = Math.floor(Date.now() / 1000);
    const SevenDaysSecond = 7 * 24 * 60 * 60;
    if (isJwtPayload(decodedToken)) {
      expect(decodedToken.exp).to.be.closeTo(
        dateNowSeconds + SevenDaysSecond,
        10
      );
    }

    const loginUser = responseLogin.data.data.loginUser.user;
    expect(loginUser).to.have.property("id");
    expect(loginUser.name).to.equal(validUser.name);
    expect(loginUser.email).to.equal(validUser.email);
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
