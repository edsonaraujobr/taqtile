import { server } from "../src/server.js";
import dotenv from "dotenv";

dotenv.config({ path: "../test.env" });

before(() => {
  server.listen({ port: 4000 }, () => {
    console.log("Servidor iniciado em http://localhost:4000");
  });
});
