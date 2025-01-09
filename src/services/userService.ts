import { prisma } from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { userValidator } from "../validators/userValidator.js";
import { SALT_ROUNDS, MAX_AGE } from "../utils/constants.js";
import { CustomError } from "../errors/customError.js";
import { ZodError } from "zod";
import { BadInputError } from "../errors/badInputError.js";
import { UserAlreadyExists } from "../errors/userAlreadyExistsError.js";
import { InternalServerError } from "../errors/internalServerError.js";

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
          throw new BadInputError({
            message: "A senha fornecida não é segura.",
          });
        }
        throw new BadInputError({
          message: error.errors[0].message,
        });
      }

      throw new InternalServerError();
    }

    const { name, email, password, birthDate } = data;

    let alreadyUserWithEmail;
    try {
      alreadyUserWithEmail = await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerError();
    }

    if (alreadyUserWithEmail) {
      throw new UserAlreadyExists({
        message: "Já existe usuário com este email",
      });
    }

    if (dayjs(birthDate).isAfter(new Date())) {
      throw new BadInputError({
        message: "Data de nascimento não pode ser no futuro!",
      });
    }

    if (!dayjs(birthDate).isValid()) {
      throw new BadInputError({
        message: "Formato de data inválido!",
      });
    }

    const age = dayjs().diff(dayjs(birthDate), "year");
    if (age > MAX_AGE) {
      throw new BadInputError({
        message: `A idade máxima permitida é de ${MAX_AGE} anos!`,
      });
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
