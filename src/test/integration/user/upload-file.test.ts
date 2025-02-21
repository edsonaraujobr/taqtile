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

    fs.writeFileSync(testFilePath, "id,nome,email\n1,João,joao@email.com\n2,Maria,maria@email.com");
  });

  beforeEach(async () => {
    await clearDB();
  });

  it("Deve realizar o upload de arquivo com sucesso",  async () => {

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation, variables } = createMutationUploadFileTest({ file: fileStream });

    const formData = new FormData();
    formData.append("operations", JSON.stringify({
      query: mutation,
      variables: { file: null },
    }));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as any, "test.csv");

    const response = await axios.post("http://localhost:4000/graphql", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    expect(response.data.data.uploadFile).to.be.equal("Arquivo test.csv enviado com sucesso!");
  })

  it("Deve retornar erro ao tentar criar repositório upload",  async () => {
    sinon.stub(fs, "existsSync").returns(false);
    const mkdirStub = sinon.stub(fs, "mkdirSync").throws(new Error("Permissão negada!"));

    const filePath = path.resolve(__dirname, "test-files", "test.csv");
    const fileStream = fs.createReadStream(filePath);

    const { mutation, variables } = createMutationUploadFileTest({ file: fileStream });

    const formData = new FormData();
    formData.append("operations", JSON.stringify({
      query: mutation,
      variables: { file: null },
    }));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as any, "test.csv");

    const response = await axios.post("http://localhost:4000/graphql", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    expect(response.data.errors[0].code).to.equal(500);
    expect(response.data.errors[0].message).to.equal(
      "Erro ao criar diretório de uploads",
    );
    expect(mkdirStub.calledOnce).to.be.true;
  })

  it("Deve retornar erro de formato de arquivo inválido", async () => {

    const testFilePath = path.join(testDir, "test.txt");
    fs.writeFileSync(testFilePath, "id,nome,email\n1,João,joao@email.com\n2,Maria,maria@email.com");

    const filePath = path.resolve(__dirname, "test-files", "test.txt");
    const fileStream = fs.createReadStream(filePath);

    const { mutation, variables } = createMutationUploadFileTest({ file: fileStream });

    const formData = new FormData();
    formData.append("operations", JSON.stringify({
      query: mutation,
      variables: { file: null },
    }));
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
    formData.append("0", fileStream as any, "test.txt");

    const response = await axios.post("http://localhost:4000/graphql", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    expect(response.data.errors[0].code).to.equal(400);
    expect(response.data.errors[0].message).to.equal(
      "Formato de arquivo inválido",
    );
  })

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
})
