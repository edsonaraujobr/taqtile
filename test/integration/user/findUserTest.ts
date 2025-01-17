import { expect } from "chai";
import axios from "axios";
import { connectDB, clearDB } from "../../helpers/dbHelper.js";
import {
  createUserInDatabaseTest,
  createAdminInDatabaseTest,
  createQueryFindUserByIDTest,
  createQueryReturnListUsersTest
} from "../../helpers/userHelper.js";
import { userData } from "../../utils/userDataUtils.js";
import { QUANTITY_DEFAULT_LIST_USERS } from "../../../src/utils/constants.js";
import { createListUsersInDatabaseSeed } from "../../../prisma/seed.js";

describe("Teste de busca de usuário", () => {

  const { validUser } = userData;

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve buscar um usuário por ID", async () => {
    const user = await createUserInDatabaseTest(validUser);
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryFindUserByIDTest({
      id: user.id,
    });

    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    const userFounded = response.data.data.findUserByID;
    expect(userFounded).to.have.property("id");
    expect(userFounded.id).equal(user.id);
    expect(userFounded.name).to.equal(user.name);
    expect(userFounded.email).to.equal(user.email);
    expect(userFounded.birthDate).to.equal(user.birthDate);
  });

  it("Deve retornar erro ao tentar buscar um usuário inexistente por ID", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryFindUserByIDTest({
      id: "1213445454545",
    });

    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(404);
    expect(response.data.errors[0].message).to.equal("Usuário não encontrado!");
  });

  it("Deve retornar erro por falta autenticação ao tentar buscar um usuário por ID", async () => {
    const user = await createUserInDatabaseTest(validUser);

    const { query, variables } = createQueryFindUserByIDTest({
      id: user.id,
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query,
      variables,
    });

    expect(response.data.errors[0].code).to.equal(401);
    expect(response.data.errors[0].message).to.equal("Usuário não autorizado");
  });

  it("Deve retornar uma lista de usuario sem parametro de quantidade", async () => {
    await createListUsersInDatabaseSeed();
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryReturnListUsersTest();
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query,
        variables
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.data.listUsers.users).to.have.lengthOf(
      QUANTITY_DEFAULT_LIST_USERS,
    );

    response.data.data.listUsers.users.forEach((user) => {
      expect(user).to.have.property("id");
      expect(user).to.have.property("name");
      expect(user).to.have.property("email");
      expect(user).to.have.property("birthDate");
    });
  });

  it("Deve retornar uma lista com 5 usuarios", async () => {
    await createListUsersInDatabaseSeed();
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryReturnListUsersTest({
      quantity: 5,
    });
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.data.listUsers.users).to.have.lengthOf(5);

    response.data.data.listUsers.users.forEach((user) => {
      expect(user).to.have.property("id");
      expect(user).to.have.property("name");
      expect(user).to.have.property("email");
      expect(user).to.have.property("birthDate");
    });
  });

  it("Deve retornar uma lista com 10 usuarios apos os 10 primeiros usuarios", async () => {
    await createListUsersInDatabaseSeed();
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryReturnListUsersTest({
      quantity: 10,
      skip: 10,
    });
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );
    expect(response.data.data.listUsers.users).to.have.lengthOf(10);
    expect(response.data.data.listUsers.hasPreviousPage).to.be.true;
    expect(response.data.data.listUsers.hasNextPage).to.be.true;
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
