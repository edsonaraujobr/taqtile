import { prisma } from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import {
  userCreateValidator,
  userLoginValidator,
} from "../validators/userValidator.js";
import { SALT_ROUNDS, MAX_AGE } from "../utils/constants.js";
import { ZodError } from "zod";
import { BadInputError } from "../errors/badInputError.js";
import { UserAlreadyExistsError } from "../errors/userAlreadyExistsError.js";
import { InternalServerError } from "../errors/internalServerError.js";
import { MaximumAgeError } from "../errors/maximumAgeError.js";
import { DateBirthdayFutureError } from "../errors/dateBirthdayFutureError.js";

export class UserService {
  static async createUser(data: any) {
    try {
      userCreateValidator.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const passwordError = error.errors.find((err) =>
          err.path.includes("password"),
        );
        if (passwordError) {
          throw new BadInputError({
            message:
              "A senha fornecida não é segura. É necessário 06 caracteres, sendo, no mínimo, um digito e um número ",
          });
        }
        throw new BadInputError({
          message: error.errors[0].message,
        });
      }

      throw new InternalServerError();
    }

    const { name, email, password, birthDate } = data;

    if (dayjs(birthDate).isAfter(new Date())) {
      throw new DateBirthdayFutureError({
        message: "Data de nascimento não pode ser no futuro!",
      });
    }

    const age = dayjs().diff(dayjs(birthDate), "year");
    if (age > MAX_AGE) {
      throw new MaximumAgeError({
        message: `A idade máxima permitida é de ${MAX_AGE} anos!`,
      });
    }

    let alreadyUserWithEmail;
    try {
      alreadyUserWithEmail = await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerError();
    }

    if (alreadyUserWithEmail) {
      throw new UserAlreadyExistsError({
        message: "Já existe usuário com este email",
      });
    }

    const formattedBirthDate = dayjs(birthDate, "DD-MM-YYYY").toISOString();
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        birthDate: formattedBirthDate,
      },
    });

    return {
      ...newUser,
      birthDate: dayjs(newUser.birthDate).format("DD-MM-YYYY"),
    };
  }

  static async loginUser(data) {
    try {
      userLoginValidator.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const passwordError = error.errors.find((err) =>
          err.path.includes("password"),
        );
        if (passwordError) {
          throw new CustomError(400, "A senha tem no mínimo 6 caracteres");
        }
        throw new CustomError(400, error.errors[0].message, "Email inválido");
      }

      throw new CustomError(500, "Erro interno no servidor.");
    }
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new CustomError(400, "Usuário não encontrado");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError(400, "Usuário não encontrado");
    }

    const token = JwtService.generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
      },
      token,
    };
  }
}
