import { prisma } from "../lib/prisma.js";

export async function createUser() {
  const user = await prisma.user.create({
    data: {
      email: "teste@gmail.com",
    },
  });
  return user;
}
