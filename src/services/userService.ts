import { prisma } from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { userValidator } from "../validators/useValidator.js";
import { SALT_ROUNDS, MAX_AGE } from "../utils/constants.js";

export class UserService {
  static async createUser(data: any) {
    userValidator.parse(data);

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
  }
}
