import { expect } from "chai";
import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "../../../src/prisma/prisma.js";
import { connectDB, clearDB } from "../../utils/dbHelper.js";
import { SALT_ROUNDS } from "../../../src/utils/constants.js";
import { BadInputError } from "../../../src/errors/badInputError.js";

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

    try {
      await axios.post("http://localhost:4000/graphql", {
        query: loginUsermutation,
      });
    } catch (error: any) {
      expect(error.responseLogin.data.errors[0].code).to.equal(404);
      expect(error.responseLogin.data.errors[0].message).to.equal(
        "Usuário não encontrado. Verifique seu email e senha",
      );
    }
  });

  it("Deve criar o usuário no banco de dados e realizar login com sucesso", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "edson1010";
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

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
    const email = "edsoasasan@gmail.com";
    const password = "edson1010";
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    const loginUsermutation = `
      mutation {
        loginUser(data: { email: "${email}", password: "edson123" }) {
          user {
            id
            name
            email
          }
          token
        }
      }
    `;

    const response = await axios.post("http://localhost:4000/graphql", {
      query: loginUsermutation,
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
