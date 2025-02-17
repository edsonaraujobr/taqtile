import { database } from "../../data/database/database.js";

export const connectDB = async () => {
  try {
    await database.$connect();
    console.log("Banco de dados executando com sucesso.");
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados");
  }
};

export const clearDB = async () => {
  try {
    await database.$transaction([
      database.address.deleteMany(),
      database.user.deleteMany(),
    ]);
    console.log("Banco de dados limpo com sucesso.");
  } catch (error) {
    console.error("Erro ao limpar o banco de dados");
  }
};
