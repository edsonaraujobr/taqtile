import { expect } from "chai";
import axios from "axios"
import { connectDB, clearDB } from "@test/helpers/db.helper";
import {
  createAddressInDatabase,
  createMutationCreateAddressTest,
} from "@test/helpers/address.helper";
import { addressData } from "@test/utils/address.data-utils";
import {
  createAdminInDatabaseTest,
  createUserInDatabaseTest,
} from "@test/helpers/user.helper";
import { userData } from "@test/utils/user.data-utils";

describe("Teste de criação de endereço", async () => {
  const { validAddress01, validAddress02 } = addressData;
  const { validUser } = userData;

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve criar um endereço no banco de dados com todas informações e vincular um usuário a ele", async () => {
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      userId: user.id,
    };

    const result = await createAddressInDatabase(address);
    expect(result).to.have.property("id");
    expect(result.cep).to.equal(validAddress01.cep);
    expect(result.street).to.equal(validAddress01.street);
    expect(result.streetNumber).to.equal(validAddress01.streetNumber);
    expect(result.complement).to.equal(validAddress01.complement);
    expect(result.neighborhood).to.equal(validAddress01.neighborhood);
    expect(result.city).to.equal(validAddress01.city);
    expect(result.state).to.equal(validAddress01.state);
    expect(result.userId).to.equal(user.id);
  });

  it("Deve criar um usuário e associar dois endereços a ele ", async () => {
    const user = await createUserInDatabaseTest(validUser);

    const address01 = {
      ...validAddress01,
      userId: user.id,
    };

    const result = await createAddressInDatabase(address01);
    expect(result).to.have.property("id");
    expect(result.cep).to.equal(validAddress01.cep);
    expect(result.street).to.equal(validAddress01.street);
    expect(result.streetNumber).to.equal(validAddress01.streetNumber);
    expect(result.complement).to.equal(validAddress01.complement);
    expect(result.neighborhood).to.equal(validAddress01.neighborhood);
    expect(result.city).to.equal(validAddress01.city);
    expect(result.state).to.equal(validAddress01.state);
    expect(result.userId).to.equal(user.id);

    const address02 = {
      ...validAddress02,
      userId: user.id,
    };

    const result02 = await createAddressInDatabase(address02);
    expect(result02).to.have.property("id");
    expect(result02.cep).to.equal(validAddress02.cep);
    expect(result02.street).to.equal(validAddress02.street);
    expect(result02.streetNumber).to.equal(validAddress02.streetNumber);
    expect(result02.complement).to.equal(validAddress02.complement);
    expect(result02.neighborhood).to.equal(validAddress02.neighborhood);
    expect(result02.city).to.equal(validAddress02.city);
    expect(result02.state).to.equal(validAddress02.state);
    expect(result02.userId).to.equal(user.id);
  });

  it("Deve criar um endereco para um usuario atraves da mutation createAddress", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);

    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );
    const result = response.data.data.createAddress;
    expect(result).to.have.property("id");
    expect(result.cep).to.equal(validAddress01.cep);
    expect(result.street).to.equal(validAddress01.street);
    expect(result.streetNumber).to.equal(validAddress01.streetNumber);
    expect(result.complement).to.equal(validAddress01.complement);
    expect(result.neighborhood).to.equal(validAddress01.neighborhood);
    expect(result.city).to.equal(validAddress01.city);
    expect(result.state).to.equal(validAddress01.state);
    expect(result.userId).to.equal(user.id);
  });

  it("Deve criar dois enderecos para um usuario atraves da mutation createAddress", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address01 = {
      ...validAddress01,
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address01);

    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );
    const result = response.data.data.createAddress;
    expect(result).to.have.property("id");
    expect(result.cep).to.equal(validAddress01.cep);
    expect(result.street).to.equal(validAddress01.street);
    expect(result.streetNumber).to.equal(validAddress01.streetNumber);
    expect(result.complement).to.equal(validAddress01.complement);
    expect(result.neighborhood).to.equal(validAddress01.neighborhood);
    expect(result.city).to.equal(validAddress01.city);
    expect(result.state).to.equal(validAddress01.state);
    expect(result.userId).to.equal(user.id);

    const address02 = {
      ...validAddress02,
      userId: user.id,
    };
    const { mutation: mutation02, variables: variables02 } =
      createMutationCreateAddressTest(address02);

    const response02 = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation02,
        variables: variables02,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    const result02 = response02.data.data.createAddress;
    expect(result02).to.have.property("id");
    expect(result02.cep).to.equal(validAddress02.cep);
    expect(result02.street).to.equal(validAddress02.street);
    expect(result02.streetNumber).to.equal(validAddress02.streetNumber);
    expect(result02.complement).to.equal(validAddress02.complement);
    expect(result02.neighborhood).to.equal(validAddress02.neighborhood);
    expect(result02.city).to.equal(validAddress02.city);
    expect(result02.state).to.equal(validAddress02.state);
    expect(result02.userId).to.equal(user.id);
  });

  it("Deve retornar erro de autenticacao ao tentar criar um endereco atraves da mutation createAddress", async () => {
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);

    const response = await axios.post("http://localhost:4000/graphql", {
      query: mutation,
      variables,
    });

    expect(response.data.errors[0].code).to.equal(401);
    expect(response.data.errors[0].message).to.equal("Usuário não autorizado");
  });

  it("Deve retornar erro de usuario nao encontrado ao tentar criar um endereco atraves da mutation createAddress", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();

    const address = {
      ...validAddress01,
      userId: "xxxxxxx-xxxxxxx",
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);

    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
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

  it("Deve retornar erro de cep invalido na criacao de um endereco", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      cep: "1",
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
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
      "Formato de CEP inválido. O formato correto é xxxxx-xxxx",
    );
  });

  it("Deve retornar erro por falta de rua na criacao de um endereco", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      street: "",
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );
    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal("Rua é obrigatório!");
  });

  it("Deve retornar erro pois numero da rua deve ser positivo", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      streetNumber: -10,
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
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
      "Número da rua deve ser positivo",
    );
  });

  it("Deve retornar erro por falta de bairro na criacao de um endereco", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      neighborhood: "",
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );
    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal("Bairro é obrigatório!");
  });

  it("Deve retornar erro por falta de cidade na criacao de um endereco", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      city: "",
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );
    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal("Cidade é obrigatório!");
  });

  it("Deve retornar erro por falta de estado na criacao de um endereco", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();
    const user = await createUserInDatabaseTest(validUser);

    const address = {
      ...validAddress01,
      state: "",
      userId: user.id,
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );
    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal("Estado é obrigatório!");
  });

  it("Deve retornar erro por falta de id na criacao de um endereco", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();

    const address = {
      ...validAddress01,
      userId: "",
    };
    const { mutation, variables } = createMutationCreateAddressTest(address);
    const response = await axios.post(
      "http://localhost:4000/graphql",
      {
        query: mutation,
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
      "ID do usuário é obrigatório!",
    );
  });

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
