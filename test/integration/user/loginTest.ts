import { expect } from "chai";
import axios from "axios";
import { connectDB, clearDB } from "../../helpers/dbHelper.js";
import {
  createMutationLoginUserTest,
  createUserInDatabaseTest,
} from "../../helpers/userHelper.js";
import { userData } from "../../utils/userDataUtils.js";
import { JwtService } from "../../../src/services/jwtService.js";

describe("User Mutation - Teste de Login", () => {
  const { validUser } = userData;

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve retornar erro no login pois o usuário não existe", async () => {
    const mutation = createMutationLoginUserTest({
      email: "edson@gmail.com",
      password: "edson123",
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });

    expect(response.data.errors[0].code).to.equal(404);
    expect(response.data.errors[0].message).to.equal(
      "Usuário não encontrado. Verifique seu email e senha",
    );
  });

  it("Deve criar o usuário no banco de dados e realizar login com sucesso", async () => {
    await createUserInDatabaseTest(validUser);

    const mutation = createMutationLoginUserTest({
      email: validUser.email,
      password: validUser.password,
    });

    const responseLogin = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });

    const token = responseLogin.data.data.loginUser.token;
    expect(token).to.be.a("string");
    expect(token.split(".")).to.have.length(3);

    const decodedToken = JwtService.decodeToken(token);
    expect(decodedToken).to.have.property("exp");

    const dateNowSeconds = Math.floor(Date.now() / 1000);
    const OneHourInSeconds = 60 * 60;
    expect(decodedToken.exp).to.be.closeTo(
      dateNowSeconds + OneHourInSeconds,
      10,
    );

    const loginUser = responseLogin.data.data.loginUser.user;
    expect(loginUser).to.have.property("id");
    expect(loginUser.name).to.equal(validUser.name);
    expect(loginUser.email).to.equal(validUser.email);
  });

  it("Deve retornar erro de senha incorreta", async () => {
    await createUserInDatabaseTest(validUser);

    const mutation = createMutationLoginUserTest({
      email: validUser.email,
      password: "edson2025",
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });
    expect(response.data.errors[0].code).to.equal(404);
    expect(response.data.errors[0].message).to.equal(
      "Usuário não encontrado. Verifique seu email e senha",
    );
  });

  it("Deve realizar login com remember-me ativado", async () => {
    await createUserInDatabaseTest(validUser);

    const mutation = createMutationLoginUserTest({
      email: validUser.email,
      password: validUser.password,
      rememberMe: true,
    });

    const responseLogin = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });

    const token = responseLogin.data.data.loginUser.token;
    expect(token).to.be.a("string");
    expect(token.split(".")).to.have.length(3);

    const decodedToken = JwtService.decodeToken(token);
    expect(decodedToken).to.have.property("exp");

    const dateNowSeconds = Math.floor(Date.now() / 1000);
    const SevenDaysSecond = 7 * 24 * 60 * 60;
    expect(decodedToken.exp).to.be.closeTo(
      dateNowSeconds + SevenDaysSecond,
      10,
    );

    const loginUser = responseLogin.data.data.loginUser.user;
    expect(loginUser).to.have.property("id");
<<<<<<< HEAD
<<<<<<< HEAD
    expect(loginUser.name).to.equal(validUser.name);
    expect(loginUser.email).to.equal(validUser.email);
=======
    expect(loginUser.name).to.equal(name);
    expect(loginUser.email).to.equal(email);
>>>>>>> f8d8cac (feat: create remember-me to user login)
=======
    expect(loginUser.name).to.equal(validUser.name);
    expect(loginUser.email).to.equal(validUser.email);
>>>>>>> 815b0e3 (update test login with authentication)
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
