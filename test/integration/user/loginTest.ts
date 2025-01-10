import { expect } from "chai";
import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "../../../src/prisma/prisma.js";
import { connectDB, clearDB } from "../../utils/dbHelper.js";

describe("User Mutation - Teste de Login", () => {
  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve retornar erro no login pois o usuário não existe", async () => {
    const email = "edson@gmail.com";
    const password = "edson123";

    const loginUsermutation = `
    mutation {
      loginUser(data: { email: "${email}", password: "${password}" }) {
        user {
          id
          name
          email
          birthDate
        }
        token
      }
    }
  `;

    let responseLogin;
    try {
      responseLogin = await axios.post("http://localhost:4000/graphql", {
        query: loginUsermutation,
      });
    } catch (error: any) {
      expect(error.responseLogin.data.errors[0].code).to.equal(404);
      expect(error.responseLogin.data.errors[0].message).to.equal(
        "Usuário não encontrado. Verifique seu email e senha",
      );
    }
  });

  it("Deve criar o usuário e realizar login com sucesso", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "edson1010";

    const createUsermutation = `
      mutation {
        createUser(data: { name: "${name}", email: "${email}", password: "${password}" }) {
          id
          name
          email
        }
      }
    `;

    const response = await axios.post("http://localhost:4000/graphql", {
      query: createUsermutation,
    });

    const createdUser = response.data.data.createUser;
    expect(createdUser).to.have.property("id");
    expect(createdUser.name).to.equal(name);
    expect(createdUser.email).to.equal(email);

    const userInDb = await prisma.user.findUnique({
      where: { email },
    });

    expect(userInDb).to.not.be.null;
    expect(userInDb.name).to.equal(name);
    expect(userInDb.email).to.equal(email);

    const passwordMatch = await bcrypt.compare(password, userInDb.password);
    expect(passwordMatch).to.be.true;

    const loginUsermutation = `
      mutation {
        loginUser(data: { email: "${email}", password: "${password}" }) {
          user {
            id
            name
            email
            birthDate
          }
          token
        }
      }
    `;
    const responseLogin = await axios.post("http://localhost:4000/graphql", {
      query: loginUsermutation,
    });

    const loginUser = responseLogin.data.data.loginUser.user;
    const token = responseLogin.data.data.loginUser.token;
    expect(token).to.be.a("string");
    expect(token.split(".")).to.have.length(3);
    expect(loginUser).to.have.property("id");
    expect(createdUser.name).to.equal(name);
    expect(createdUser.email).to.equal(email);

    const userDB = await prisma.user.findUnique({
      where: { email },
    });

    expect(userDB).to.not.be.null;
    expect(userDB.name).to.equal(name);
    expect(userDB.email).to.equal(email);

    const passwordValid = await bcrypt.compare(password, userDB.password);
    expect(passwordValid).to.be.true;
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
