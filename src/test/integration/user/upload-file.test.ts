import { clearDB, connectDB } from "@test/helpers/db.helper";
import { createMutationUploadFileTest } from "@test/helpers/user.helper";
import axios from "axios";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import sinon from "sinon";

const testDir = path.resolve(__dirname, "test-files");
const testFilePath = path.join(testDir, "test.csv");

describe("Teste de Upload de arquivos", () => {
  before(async () => {
    await connectDB();

    const testDir = path.resolve(__dirname, "test-files");
    const testFilePath = path.join(testDir, "test.csv");

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\nJoão,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,A,32,Z-32",
    );
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve realizar o upload de arquivo com sucesso", async () => {
    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationUploadFileTest({ file: fileStream });

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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );
    expect(response.data.data.uploadFile).to.be.equal(
      "Arquivo test.csv enviado com sucesso!",
    );
  });

  it("Deve retornar erro ao tentar criar repositório upload", async () => {
    sinon.stub(fs, "existsSync").returns(false);
    const mkdirStub = sinon
      .stub(fs, "mkdirSync")
      .throws(new Error("Permissão negada!"));

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationUploadFileTest({ file: fileStream });

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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );

    expect(response.data.errors[0].code).to.equal(500);
    expect(response.data.errors[0].message).to.equal(
      "Erro ao criar diretório de uploads",
    );
    expect(mkdirStub.calledOnce).to.be.equal(true);
  });

  it("Deve retornar erro de extensão do arquivo inválido", async () => {
    const testFilePath = path.join(testDir, "test.txt");
    fs.writeFileSync(
      testFilePath,
      "name,email,birthDate,zipCode,city,state,neighborhood,street,streetNumber,complement\nJoão,joao@email.com,12-12-2000,4000000,Salvador,Bahia,Liberdade,A,32,Z-32",
    );

    const filePath = path.resolve(__dirname, "test-files", "test.txt");
    const fileStream = fs.createReadStream(filePath);

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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

    const { mutation } = createMutationUploadFileTest({
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

    const response = await axios.post(
      "http://localhost:4000/graphql",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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
    sinon.restore();
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
