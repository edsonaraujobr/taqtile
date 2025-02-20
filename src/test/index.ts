import { createServer } from "../api/server";
import dotenv from "dotenv";
dotenv.config({ path: "../../test.env" });

before(async () => {
  const { app } = await createServer();
  app.listen({ port: 4000 }, () => {
    console.log("Servidor de testes iniciado em http://localhost:4000");
  });
});
