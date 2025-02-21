import { expect } from 'chai';
import bcrypt from "bcryptjs";
import axios from "axios";
import { database } from "@data/database/database";
import { connectDB, clearDB } from "@test/helpers/db.helper";
import {
  createAdminInDatabaseTest,
  createMutationCreateUserTest,
  createUserInDatabaseTest,
} from "@test/helpers/user.helper";
import { userData } from "@test/utils/user.data-utils";
import { MAX_AGE } from "@core/utils/constants";

describe("User Mutation - Teste de Criação de usuário", () => {
  const {
    validUser,
    validUserWithoutBirthDate,
    duplicateEmailUser,
    futureBirthDateUser,
    invalidBirthDateUser,
    maxAgeExceededUser,
    weakPasswordUser,
  } = userData;

  before(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve criar um novo usuario com todas as informacoes", async () => {
    const email = "other@email.com";

    const { mutation, variables } = createMutationCreateUserTest({
      ...validUser,
      email,
    });
    const tokenAdmin = await createAdminInDatabaseTest();

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
    const createdUser = response.data.data.createUser;
    expect(createdUser).to.have.property("id");
    expect(createdUser.name).to.equal(validUser.name);
    expect(createdUser.email).to.equal(email);
    expect(createdUser.birthDate).to.equal(validUser.birthDate);

    const userInDb = await database.user.findUnique({
      where: { email },
    });

    expect(userInDb).to.not.be.null;
    expect(userInDb.name).to.equal(validUser.name);
    expect(userInDb.email).to.equal(email);

    const passwordMatch = await bcrypt.compare(
      validUser.password,
      userInDb.password,
    );
    expect(passwordMatch).to.be.true;
  });

  it("Deve criar um novo usuario sem o campo opcional de data de nascimento", async () => {
    const { mutation, variables } = createMutationCreateUserTest(
      validUserWithoutBirthDate,
    );
    const tokenAdmin = await createAdminInDatabaseTest();

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

    const createdUser = response.data.data.createUser;

    expect(createdUser).to.have.property("id");
    expect(createdUser.name).to.equal(validUserWithoutBirthDate.name);
    expect(createdUser.email).to.equal(validUserWithoutBirthDate.email);

    const userInDb = await database.user.findUnique({
      where: { email: validUserWithoutBirthDate.email },
    });

    expect(userInDb).to.not.be.null;
    expect(userInDb.name).to.equal(validUserWithoutBirthDate.name);
    expect(userInDb.email).to.equal(validUserWithoutBirthDate.email);

    const passwordMatch = await bcrypt.compare(
      validUserWithoutBirthDate.password,
      userInDb.password,
    );
    expect(passwordMatch).to.be.true;
  });

  it("Deve retornar erro se o usuário já existir", async () => {
    await createUserInDatabaseTest(duplicateEmailUser);

    const { mutation, variables } = createMutationCreateUserTest(duplicateEmailUser);
    const tokenAdmin = await createAdminInDatabaseTest();

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
    expect(response.data.errors[0].code).to.equal(409);
    expect(response.data.errors[0].message).to.equal(
      "Já existe usuário com este email",
    );
  });

  it("Deve retornar erro para senha fraca", async () => {
    const { mutation, variables } =
      createMutationCreateUserTest(weakPasswordUser);
    const tokenAdmin = await createAdminInDatabaseTest();

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
      "A senha fornecida não é segura. É necessário no mínimo 6 caracteres, incluindo pelo menos um dígito e uma letra.",
    );
  });

  it("Deve retornar erro pela data de nascimento no futuro", async () => {
    const { mutation, variables } =
      createMutationCreateUserTest(futureBirthDateUser);
    const tokenAdmin = await createAdminInDatabaseTest();

    try {
      await axios.post(
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
    } catch (error: any) {
      expect(error.response.data.errors[0].code).to.equal(422);
      expect(error.response.data.errors[0].message).to.equal(
        "Data de nascimento não pode ser no futuro!",
      );
    }
  });

  it("Deve retornar erro pela formato de data errado", async () => {
    const { mutation, variables } =
      createMutationCreateUserTest(invalidBirthDateUser);
    const tokenAdmin = await createAdminInDatabaseTest();

    try {
      await axios.post(
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
    } catch (error: any) {
      expect(error.response.data.errors[0].code).to.equal(400);
      expect(error.response.data.errors[0].message).to.equal(
        "Formato de data inválido. Use o formato DD-MM-YYYY.",
      );
    }
  });

  it("Deve retornar erro pela idade maxima permitida excedida", async () => {
    const { mutation, variables } = createMutationCreateUserTest(maxAgeExceededUser);
    const tokenAdmin = await createAdminInDatabaseTest();

    try {
      await axios.post(
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
