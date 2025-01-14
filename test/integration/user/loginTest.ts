import { expect } from "chai";

import axios from "axios";
import { prisma } from "../../../src/prisma/prisma.js";
import { connectDB, clearDB } from "../../utils/dbHelper.js";

import {
  createUserForLoginTest,
  createUserInDatabaseForLoginTest,
} from "../../utils/userHelper.js";

describe("User Mutation - Teste de Login", () => {
  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve retornar erro no login pois o usuário não existe", async () => {
    const mutation = createUserForLoginTest({
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
    const name = "Edson Araújo";
    const email = "edson@gmail.com";
    const password = "edson123";

    await createUserInDatabaseForLoginTest({
      name,
      email,
      password,
    });

    const mutation = createUserForLoginTest({
      email,
      password,
    });

    const responseLogin = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });

    const token = responseLogin.data.data.loginUser.token;
    expect(token).to.be.a("string");
    expect(token.split(".")).to.have.length(3);

    const loginUser = responseLogin.data.data.loginUser.user;
    expect(loginUser).to.have.property("id");
    expect(loginUser.name).to.equal(name);
    expect(loginUser.email).to.equal(email);
  });

  it("Deve retornar erro de senha incorreta", async () => {
    const name = "Edson Araújo";
    const email = "edson@gmail.com";
    const password = "edson123";

    await createUserInDatabaseForLoginTest({
      name,
      email,
      password,
    });

    const mutation = createUserForLoginTest({
      email,
      password: "edson1010",
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });
    expect(response.data.errors[0].code).to.equal(404);
    expect(response.data.errors[0].message).to.equal(
      "Usuário não encontrado. Verifique seu email e senha",
    );
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
