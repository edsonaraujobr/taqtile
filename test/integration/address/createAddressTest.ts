import { expect } from "chai";
import axios from "axios";
import { connectDB, clearDB } from "../../helpers/dbHelper.js";
import { createAddressInDatabase } from "../../helpers/addressHelper.js";
import { addressData } from "../../utils/addressDataUtils.js";
import { createUserInDatabaseTest } from "../../helpers/userHelper.js";
import { userData } from "../../utils/userDataUtils.js";

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

  afterEach(async () => {
    await clearDB();
  });

  after(async () => {
    await clearDB();
  });
});
