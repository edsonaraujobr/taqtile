import axios from "axios";
import { expect } from "chai";

describe("Teste de API", () => {
  it("Deve retornar a mensagem hello", async () => {
    const query = {
      query: `{
        hello
      }`,
    };

    const response = await axios.post("http://localhost:4000/graphql", query);

    expect(response.data.data.hello).to.equal("Hello world");
  });
});
