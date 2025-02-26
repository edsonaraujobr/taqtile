import { clearDB, connectDB } from "@test/helpers/db.helper";
import {
  createAdminInDatabaseTest,
  createMutationCreateManyUsersCSVTest,
} from "@test/helpers/user.helper";
import axios from "axios";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import FormData from "form-data";

const testDir = path.resolve(__dirname, "test-files");
const testFilePath = path.join(testDir, "test.csv");

describe("Teste de criacao de varios usuarios atraves de csv", () => {
  before(async () => {
    await connectDB();

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve criar um usuario atraves de CSV com sucesso", async () => {
    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    fs.writeFileSync(
      filePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\nJoão,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,A,32,Z-32",
    );
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.data.createManyUsersCSV).to.be.equal(
      "Foram cadastrados 1 usuários.",
    );
  });

  it("Deve criar cinco usuarios atraves de CSV com sucesso", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      `name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement
    João,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,Rua A,32,Z-32
    João,joao12@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,Rua A,32,Z-32
    João,joao123@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,Rua A,32,Z-32
    João,joao1234@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,Rua A,32,Z-32
    João,joao12345@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,Rua A,32,Z-32`,
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.data.createManyUsersCSV).to.be.equal(
      "Foram cadastrados 5 usuários.",
    );
  });

  it("Deve criar um usuário e avisar que o outro não foi criado pois já existe usuario com este email", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      `name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement
    João,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,Rua A,32,Z-32
    Joao Felipe,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,Rua A,32,Z-32`,
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.data.createManyUsersCSV).to.be.equal(
      "Foram cadastrados 1 usuários. Os seguintes usuários foram ignorados por já estarem cadastrados: Nome: Joao Felipe, Email: joao@email.com",
    );
  });

  it("Deve retornar erro de extensão do arquivo inválido", async () => {
    const testFilePath = path.join(testDir, "test.txt");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\nJoão,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,A,32,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.txt");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.txt");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Extensão do arquivo inválido",
    );
  });

  it("Deve retornar erro de arquivo vazio", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(testFilePath, "");

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "O arquivo CSV está vazio ou inválido",
    );
  });

  it("Deve retornar erro de falta de nome no arquivo", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\n,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,A,32,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: O campo name é obrigatório e deve ser uma string.",
    );
  });

  it("Deve retornar erro de email inválido", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\njoao,joao,12-12-2000,4000000,Salvador,Bahia,Liberdade,A,32,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: Email inválido! Seu email precisa de um @ e um domínio.",
    );
  });

  it("Deve retornar erro de data de nascimento no formato errado", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\njoao,joao@gmail.com,12/12/2000,4000000,Salvador,Bahia,Liberdade,A,32,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: Formato de data inválido. Use o formato DD-MM-YYYY.",
    );
  });

  it("Deve retornar erro de falta de numero da rua", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\njoao,joao@gmail.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,A,,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: O campo streetNumber é obrigatório e deve ser uma string não vazia.",
    );
  });

  it("Deve retornar erro de falta do nome da rua", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\njoao,joao@gmail.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,,10,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: O campo street é obrigatório e deve ser uma string não vazia.",
    );
  });

  it("Deve retornar erro de falta do nome do bairro", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\njoao,joao@gmail.com,12-12-2000,4000000,Salvador,Bahia,,A,10,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: O campo neighborhood é obrigatório e deve ser uma string não vazia.",
    );
  });

  it("Deve retornar erro de falta do nome do estado", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\njoao,joao@gmail.com,12-12-2000,4000000,Salvador,,Jardim,A,10,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: O campo state é obrigatório e deve ser uma string não vazia.",
    );
  });

  it("Deve retornar erro de falta do nome da cidade", async () => {
    const testFilePath = path.join(testDir, "test.csv");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\njoao,joao@gmail.com,12-12-2000,4000000,,Bahia,Jardim,A,10,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationCreateManyUsersCSVTest({
      file: fileStream,
    });

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: { file: null },
      }),
    );
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as unknown, "test.csv");

    const tokenAdmin = await createAdminInDatabaseTest();

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${tokenAdmin}`,
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Erro na linha 1: O campo city é obrigatório e deve ser uma string não vazia.",
    );
  });

  afterEach(async () => {
    await clearDB();
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  after(async () => {
    await clearDB();
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });
});
