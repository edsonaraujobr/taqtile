import { prisma } from "../../src/prisma/prisma.js";

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Banco de dados executando com sucesso.");
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados");
  }
};

export const clearDB = async () => {
  try {
    await prisma.$transaction([prisma.user.deleteMany()]);
    console.log("Banco de dados limpo com sucesso.");
  } catch (error) {
    console.error("Erro ao limpar o banco de dados");
  }
};
