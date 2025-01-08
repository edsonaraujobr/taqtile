import { expect } from "chai";
import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "../../../src/prisma/prisma.js";
import { connectDB, clearDB } from "../../utils/dbHelper.js";

describe("User Mutation - Teste de Integração", () => {
  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve criar um novo usuário", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "edson1010";

    const mutation = `
      mutation {
        createUser(data: { name: "${name}", email: "${email}", password: "${password}" }) {
          id
          name
          email
        }
      }
    `;

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
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
  });

  it("Deve retornar erro se o usuário já existir", async () => {
    await prisma.user.create({
      data: {
        name: "Edson Araújo",
        email: "edson@gmail.com",
        password: "hashedpassword",
      },
    });

    const mutation = `
      mutation {
        createUser(data: { 
          name: "Edson Araújo", 
          email: "edson@gmail.com", 
          password: "anotherpassword" 
        }) {
          id
          name
          email
        }
      }
    `;
    try {
      await axios.post("http://localhost:4000/graphql", {
        query: mutation,
      });
    } catch (error: any) {
      expect(error.response.data.errors[0].code).to.equal(409);
      expect(error.response.data.errors[0].message).to.equal(
        "Usuário já existe com este email.",
      );
    }
  });

  it("Deve retornar erro para senha fraca", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "123";

    const mutation = `
      mutation {
        createUser(data: { name: "${name}", email: "${email}", password: "${password}" }) {
          id
          name
          email
        }
      }
    `;

    try {
      await axios.post("http://localhost:4000/graphql", {
        query: mutation,
      });
    } catch (error: any) {
      expect(error.response.data.errors[0].code).to.equal(400);
      expect(error.response.data.errors[0].message).to.equal(
        "A senha fornecida não é segura.",
      );
    }
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
