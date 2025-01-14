import { expect } from "chai";
import bcrypt from "bcrypt";
import axios from "axios";
import { prisma } from "../../../src/prisma/prisma.js";
import { connectDB, clearDB } from "../../utils/dbHelper.js";
import { MAX_AGE } from "../../../src/utils/constants.js";
import {
  createMutationCreateUserTest,
  createUserInDatabaseTest,
} from "../../utils/userHelper.js";

describe("User Mutation - Teste de Criação de usuário", () => {
  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve criar um novo usuario com todas as informacoes", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "edson1010";
    const birthDate = "10-10-2000";

    const mutation = `
      mutation {
        createUser(data: { name: "${name}", email: "${email}", password: "${password}", birthDate: "${birthDate}" }) {
          id
          name
          email
          birthDate
        }
      }
    `;

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });

    const createdUser = response.data.data.createUser;
    console.log(createdUser)
    expect(createdUser).to.have.property("id");
    expect(createdUser.name).to.equal(name);
    expect(createdUser.email).to.equal(email);
    expect(createdUser.birthDate).to.equal(birthDate);

    const userInDb = await prisma.user.findUnique({
      where: { email },
    });

    expect(userInDb).to.not.be.null;
    expect(userInDb.name).to.equal(name);
    expect(userInDb.email).to.equal(email);

    const passwordMatch = await bcrypt.compare(password, userInDb.password);
    expect(passwordMatch).to.be.true;
  });

  it("Deve criar um novo usuario sem o campo opcional de data de nascimento", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "edson1010";

    const mutation = createMutationCreateUserTest({
      name,
      email,
      password,
    });

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
    await createUserInDatabaseTest({
      name: "Edson Araújo",
      email: "edson@gmail.com",
      password: "hashedpassword123",
    });

    const mutation = createMutationCreateUserTest({
      name: "Cristiano Ronaldo",
      email: "edson@gmail.com",
      password: "randowmpassword123",
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });
    expect(response.data.errors[0].code).to.equal(409);
    expect(response.data.errors[0].message).to.equal(
      "Já existe usuário com este email",
    );
  });

  it("Deve retornar erro para senha fraca", async () => {
    const mutation = createMutationCreateUserTest({
      name: "Cristiano Ronaldo",
      email: "edson@gmail.com",
      password: "123",
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
    });
    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "A senha fornecida não é segura. É necessário, no mínimo, 06 caracteres, sendo, ao menos, um digito e um número ",
    );
  });

  it("Deve retornar erro pela data de nascimento no futuro", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "123";
    const birthDate = "10-10-2025";

    const mutation = `
      mutation {
        createUser(data: { name: "${name}", email: "${email}", password: "${password}", birthDate: "${birthDate}" }) {
          id
          name
          email
          birthDate
        }
      }
    `;

    try {
      await axios.post("http://localhost:4000/graphql", {
        query: mutation,
      });
    } catch (error: any) {
      expect(error.response.data.errors[0].code).to.equal(422);
      expect(error.response.data.errors[0].message).to.equal(
        "Data de nascimento não pode ser no futuro!",
      );
    }
  });

  it("Deve retornar erro pela formato de data errado", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "123";
    const birthDate = "1";

    const mutation = `
      mutation {
        createUser(data: { name: "${name}", email: "${email}", password: "${password}", birthDate: "${birthDate}" }) {
          id
          name
          email
          birthDate
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
        "Formato de data inválido. Use o formato DD-MM-YYYY.",
      );
    }
  });

  it("Deve retornar erro pela idade maxima permitida excedida", async () => {
    const name = "Edson Araújo";
    const email = "edsoasasan@gmail.com";
    const password = "123";
    const birthDate = "10-10-1800";

    const mutation = `
      mutation {
        createUser(data: { name: "${name}", email: "${email}", password: "${password}", birthDate: "${birthDate}" }) {
          id
          name
          email
          birthDate
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
        `A idade máxima permitida é de ${MAX_AGE} anos!`,
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
