import { server } from "../src/server.js";

before(() => {
  server.listen({ port: 4000 }, () => {
    console.log("Servidor iniciado em http://localhost:4000");
  });
});
