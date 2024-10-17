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
    const userInput = {
      name: "Edson Araujo",
      email: "edsoasasan@gmail.com",
      password: "edson1010",
    };

    const mutation = `
      mutation {
        createUser(data: { name: "${userInput.name}", email: "${userInput.email}", password: "${userInput.password}" }) {
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
    expect(createdUser.name).to.equal(userInput.name);
    expect(createdUser.email).to.equal(userInput.email);

    const userInDb = await prisma.user.findUnique({
      where: { email: userInput.email },
    });

    expect(userInDb).to.not.be.null;
    expect(userInDb.name).to.equal(userInput.name);
    expect(userInDb.email).to.equal(userInput.email);

    const passwordMatch = await bcrypt.compare(userInput.password, userInDb.password);
    expect(passwordMatch).to.be.true;
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
