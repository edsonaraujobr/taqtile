import { prisma } from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { userValidator } from "../validators/userValidator.js";
import { SALT_ROUNDS, MAX_AGE } from "../utils/constants.js";
import { CustomError } from "../errors/customError.js";
import { ZodError } from "zod";

export class UserService {
  static async createUser(data: any) {
    try {
      userValidator.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const passwordError = error.errors.find((err) =>
          err.path.includes("password"),
        );
        if (passwordError) {
          throw new CustomError(400, "A senha fornecida não é segura.");
        }
        throw new CustomError(400, error.errors[0].message, "VALIDATION_ERROR");
      }

      throw new CustomError(500, "Erro interno no servidor.");
    }

    const { name, email, password, birthDate } = data;

    const alreadyUserWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (alreadyUserWithEmail) {
      throw new CustomError(409, "Já existe usuário com este email.", email);
    }

    if (dayjs(birthDate).isAfter(new Date())) {
      throw new CustomError(400, "Data de nascimento não pode ser no futuro!");
    }

    if (!dayjs(birthDate).isValid()) {
      throw new CustomError(400, "Formato de data inválido!");
    }

    const age = dayjs().diff(dayjs(birthDate), "year");
    if (age > MAX_AGE) {
      throw new CustomError(
        400,
        `A idade máxima permitida é de ${MAX_AGE} anos!`,
      );
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
  }
}
