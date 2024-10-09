import { prisma } from "./lib/prisma.js";
import dayjs from "dayjs";
import z from "zod";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const MAX_AGE = 130;

const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email inválido!"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres!")
    .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
    .regex(/\d/, "A senha deve conter pelo menos um dígito"),
  birthDate: z.string().optional(),
});


export const resolvers = {
  Mutation: {
    createUser: async (_, { data }) => {
      try {
        userSchema.parse(data);

        const { name, email, password, birthDate } = data;

        const alreadyUserWithEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (alreadyUserWithEmail) {
          throw new Error("Já existe um usuário com esse email!");
        }

        if (dayjs(birthDate).isAfter(new Date())) {
          throw new Error("Data de nascimento não pode ser no futuro!");
        }

        if (!dayjs(birthDate).isValid()) {
          throw new Error("Formato de data inválido!");
        }

        const age = dayjs().diff(dayjs(birthDate), "year");

        if (age > MAX_AGE) {
          throw new Error(`A idade máxima permitida é de ${MAX_AGE} anos!`);
        }

        const birthDateAsDateTime = dayjs(birthDate).toDate();

        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashPassword,
            birthDate: birthDateAsDateTime,
          },
        });

        return newUser;
      } catch (error) {
        throw new Error(`Erro ao criar usuário: ${error}`);
      }
    },
  },
  Query: {
    hello: () => "Hello world",
  },
};
