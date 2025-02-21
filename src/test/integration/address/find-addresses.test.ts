import { expect } from "chai";
import axios from "axios";
import { connectDB, clearDB } from "@test/helpers/db.helper";
import {
  createAddressInDatabase,
  createQueryFindAddressesByUserID,
} from "@test/helpers/address.helper";
import {
  createAdminInDatabaseTest,
  createUserInDatabaseTest,
} from "@test/helpers/user.helper";
import { userData } from "@test/utils/user.data-utils";
import { addressData } from "@test/utils/address.data-utils";

describe("Teste de busca de endereço", () => {
  const { validUser } = userData;
  const { validAddress01, validAddress02 } = addressData;

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve buscar todos os enderecos de um usuario", async () => {
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

    const { query, variables } = createQueryFindAddressesByUserID({
      userId: user.id,
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

    const addresses = response.data.data.getAddressesByUserId;
    expect(addresses).to.have.lengthOf(2);

    expect(addresses[0]).to.have.property("id");
    expect(addresses[0].cep).to.equal(address01.cep);
    expect(addresses[0].street).to.equal(address01.street);
    expect(addresses[0].streetNumber).to.equal(address01.streetNumber);
    expect(addresses[0].complement).to.equal(address01.complement);
    expect(addresses[0].neighborhood).to.equal(address01.neighborhood);
    expect(addresses[0].city).to.equal(address01.city);
    expect(addresses[0].state).to.equal(address01.state);
    expect(addresses[0].userId).to.equal(address01.userId);

    expect(addresses[1]).to.have.property("id");
    expect(addresses[1].cep).to.equal(address02.cep);
    expect(addresses[1].street).to.equal(address02.street);
    expect(addresses[1].streetNumber).to.equal(address02.streetNumber);
    expect(addresses[1].complement).to.equal(address02.complement);
    expect(addresses[1].neighborhood).to.equal(address02.neighborhood);
    expect(addresses[1].city).to.equal(address02.city);
    expect(addresses[1].state).to.equal(address02.state);
    expect(addresses[1].userId).to.equal(address02.userId);
  });

  it("Deve retornar erro de autenticacao ao buscar os enderecos de um usuario", async () => {
    const user = await createUserInDatabaseTest(validUser);

    const { query, variables } = createQueryFindAddressesByUserID({
      userId: user.id,
    });

    const response = await axios.post("http://localhost:4000/graphql", {
      query,
      variables,
    });

    expect(response.data.errors[0].code).to.equal(401);
    expect(response.data.errors[0].message).to.equal("Usuário não autorizado");
  });

  it("Deve retornar erro ao buscar endereco de um usuario inexistente", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const { query, variables } = createQueryFindAddressesByUserID({
      userId: "1213445454545",
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

  it("Deve retornar um array vazio a nao encontrar nenhum endereco vinculado ao usuario", async () => {
    const user = await createUserInDatabaseTest(validUser);
    const tokenAdmin = await createAdminInDatabaseTest();

    const { query, variables } = createQueryFindAddressesByUserID({
      userId: user.id,
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

    const addresses = response.data.data.getAddressesByUserId;
    expect(addresses).to.have.lengthOf(0);
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
