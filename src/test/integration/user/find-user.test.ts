import { expect } from "chai";
import axios from "axios";
import { connectDB, clearDB } from "@test/helpers/db.helper";
import {
  createUserInDatabaseTest,
  createAdminInDatabaseTest,
  createQueryFindUserByIDTest,
  createQueryReturnListUsersTest,
} from "@test/helpers/user.helper";
import { userData } from "@test/utils/user.data-utils";
import { createListUsersInDatabaseSeed } from "@data/database/seed";
import { addressData } from "@test/utils/address.data-utils";
import { createAddressInDatabase } from "@test/helpers/address.helper";
import { QUANTITY_DEFAULT_LIST_USERS } from "@core/utils/constants";

describe("Teste de busca de usuário", () => {
  const { validUser } = userData;
  const { validAddress01, validAddress02 } = addressData;

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
    expect(userFounded).to.have.property("addresses");
    expect(userFounded.addresses).to.have.lengthOf(0);
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
    const users = await createListUsersInDatabaseSeed();
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryReturnListUsersTest();
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

    const resultUsers = response.data.data.listUsers.users;

    expect(resultUsers).to.have.lengthOf(QUANTITY_DEFAULT_LIST_USERS);

    resultUsers.forEach((user, index) => {
      expect(user).to.have.property("id");
      expect(user).to.have.property("name");
      expect(user).to.have.property("email");
      expect(user).to.have.property("birthDate");
      expect(user).to.have.property("addresses");

      expect(user.name).to.equal(users[index].name);
      expect(user.email).to.equal(users[index].email);
      expect(user.birthDate).to.equal(users[index].birthDate);
      expect(user.addresses).to.have.lengthOf(0);
    });
  });

  it("Deve retornar uma lista com 5 usuarios", async () => {
    const quantitySearchUsers = 5;

    const users = await createListUsersInDatabaseSeed();
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryReturnListUsersTest({
      quantity: quantitySearchUsers,
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

    const resultUsers = response.data.data.listUsers.users;

    expect(resultUsers).to.have.lengthOf(quantitySearchUsers);

    resultUsers.forEach((user, index) => {
      expect(user).to.have.property("id");
      expect(user).to.have.property("name");
      expect(user).to.have.property("email");
      expect(user).to.have.property("birthDate");

      expect(user).to.have.property("addresses");
      expect(user.name).to.equal(users[index].name);
      expect(user.email).to.equal(users[index].email);
      expect(user.birthDate).to.equal(users[index].birthDate);
      expect(user.addresses).to.have.lengthOf(0);
    });
  });

  it("Deve retornar uma lista com 10 usuarios apos os 10 primeiros usuarios", async () => {
    const quantitySearchUsers = 10;
    await createListUsersInDatabaseSeed();
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryReturnListUsersTest({
      quantity: quantitySearchUsers,
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
    expect(response.data.data.listUsers.users).to.have.lengthOf(
      quantitySearchUsers,
    );
    expect(response.data.data.listUsers.hasPreviousPage).to.be.equal(true);
    expect(response.data.data.listUsers.hasNextPage).to.be.equal(true);
  });

  it("Deve retornar erro de autenticação ao tentar buscar uma lista de usuários", async () => {
    await createListUsersInDatabaseSeed();

    const { query, variables } = createQueryReturnListUsersTest();
    const response = await axios.post("http://localhost:4000/graphql", {
      query,
      variables,
    });

    expect(response.data.errors[0].code).to.equal(401);
    expect(response.data.errors[0].message).to.equal("Usuário não autorizado");
  });

  it("Deve retornar erro ao tentar buscar uma lista de usuários pois nao ha usuarios cadastrados", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query } = createQueryReturnListUsersTest();
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(404);
    expect(response.data.errors[0].message).to.equal(
      "Nenhum usuário encontrado!",
    );
  });

  it("Deve retornar erro ao tentar buscar uma lista de usuários pois o skip eh maior que a lista de usuarios", async () => {
    const skip = 60;
    await createListUsersInDatabaseSeed();
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryReturnListUsersTest({
      skip,
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

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "O valor de skip excede o número total de usuários disponíveis.",
    );
  });

  it("Deve buscar um usuário por ID e verificar se os enderecos sao retornados corretamente", async () => {
    const user = await createUserInDatabaseTest(validUser);
    const tokenAdmin = await createAdminInDatabaseTest();

    const address01 = {
      ...validAddress01,
      userId: user.id,
    };

    await createAddressInDatabase(address01);

    const address02 = {
      ...validAddress02,
      userId: user.id,
    };

    await createAddressInDatabase(address02);

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
    expect(userFounded).to.have.property("addresses");
    expect(userFounded.addresses).to.have.lengthOf(2);

    // address01
    expect(userFounded.addresses[0]).to.have.property("id");
    expect(userFounded.addresses[0].cep).to.equal(address01.cep);
    expect(userFounded.addresses[0].street).to.equal(address01.street);
    expect(userFounded.addresses[0].streetNumber).to.equal(
      address01.streetNumber,
    );
    expect(userFounded.addresses[0].complement).to.equal(address01.complement);
    expect(userFounded.addresses[0].neighborhood).to.equal(
      address01.neighborhood,
    );
    expect(userFounded.addresses[0].city).to.equal(address01.city);
    expect(userFounded.addresses[0].state).to.equal(address01.state);

    // address02
    expect(userFounded.addresses[1]).to.have.property("id");
    expect(userFounded.addresses[1].cep).to.equal(address02.cep);
    expect(userFounded.addresses[1].street).to.equal(address02.street);
    expect(userFounded.addresses[1].streetNumber).to.equal(
      address02.streetNumber,
    );
    expect(userFounded.addresses[1].complement).to.equal(address02.complement);
    expect(userFounded.addresses[1].neighborhood).to.equal(
      address02.neighborhood,
    );
    expect(userFounded.addresses[1].city).to.equal(address02.city);
    expect(userFounded.addresses[1].state).to.equal(address02.state);
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
