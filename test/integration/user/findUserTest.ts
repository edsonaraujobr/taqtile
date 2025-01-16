import { expect } from "chai";
import axios from "axios";
import { connectDB, clearDB } from "../../helpers/dbHelper.js";
import {
  createUserInDatabaseTest,
  createAdminInDatabaseTest,
  createQueryFindUserByIDTest
} from "../../helpers/userHelper.js";
import { userData } from "../../utils/userDataUtils.js";

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

    const query = createQueryFindUserByIDTest({
      id: user.id,
    });

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

    const userFounded = response.data.data.findUserByID;
    expect(userFounded).to.have.property("id");
    expect(userFounded.id).equal(user.id);
    expect(userFounded.name).to.equal(user.name);
    expect(userFounded.email).to.equal(user.email);
    expect(userFounded.birthDate).to.equal(user.birthDate);
  });

  it("Deve retornar erro ao tentar buscar um usuário inexistente por ID", async () => {
    const tokenAdmin = await createAdminInDatabaseTest();

    const query = createQueryFindUserByIDTest({
      id: "12121215456456-454544",
    });

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
    expect(response.data.errors[0].message).to.equal("Usuário não encontrado!");
  });
  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
