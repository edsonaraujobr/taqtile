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
import { JwtService } from "./jwtService.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { UnauthorizedUser } from "../errors/unauthorizedUser.js";
export class UserService {
  static async createUser(data: any, context: any) {
    if (!context || !context.user) {
      throw new UnauthorizedUser({ message: "Usuário não autorizado" });
    }
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
              "A senha fornecida não é segura. É necessário no mínimo 6 caracteres, incluindo pelo menos um dígito e uma letra.",
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
    const { email, password, rememberMe } = data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundError({
        message: "Usuário não encontrado. Verifique seu email e senha",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundError({
        message: "Usuário não encontrado. Verifique seu email e senha",
      });
    }

    const token = JwtService.generateToken({ id: user.id }, rememberMe);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: dayjs(user.birthDate).format("DD-MM-YYYY"),
      },
      token,
    };
  }

  static async findUserByID(id, context) {
    if (!context || !context.user) {
      throw new UnauthorizedUser({ message: "Usuário não autorizado" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }
    return user;
  }
}
