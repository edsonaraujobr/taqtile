import { createServer } from "../api/server.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../test.env" });

before(async () => {
  const server = await createServer();
  server.listen({ port: 4001 }, () => {
    console.log("Servidor iniciado em http://localhost:4001");
  });
});
