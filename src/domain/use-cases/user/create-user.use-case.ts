import { UserDBDataSource } from "../../../data/user/user.db.datasource";
import dayjs from "dayjs";
import bcrypt from "bcryptjs";
import {
  InternalServerError,
  BadInputError,
  MaximumAgeError,
  DateBirthdayFutureError,
  UserAlreadyExistsError,
} from "../../errors/index";
import { SALT_ROUNDS, MAX_AGE } from "../../../core/utils/constants";
import { ZodError } from "zod";
import { userCreateValidator } from "../../../api/modules/user/user.validator";
import { CreateUserModel, UserModel } from "../../models/index";
import { Service } from "typedi";

@Service()
export class CreateUserUseCase {
  constructor(private readonly userDataSource: UserDBDataSource) {}

  async run({ data }: { data: CreateUserModel }): Promise<UserModel> {
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

    if (dayjs(data.birthDate).isAfter(new Date())) {
      throw new DateBirthdayFutureError({
        message: "Data de nascimento não pode ser no futuro!",
      });
    }

    const age = dayjs().diff(dayjs(data.birthDate), "year");
    if (age > MAX_AGE) {
      throw new MaximumAgeError({
        message: `A idade máxima permitida é de ${MAX_AGE} anos!`,
      });
    }

    let alreadyUserWithEmail;
    try {
      alreadyUserWithEmail = await this.userDataSource.findByEmail({
        email: data.email,
      });
    } catch (error: unknown) {
      throw new InternalServerError();
    }

    if (alreadyUserWithEmail) {
      throw new UserAlreadyExistsError({
        message: "Já existe usuário com este email",
      });
    }

    const formattedBirthDate = dayjs(
      data.birthDate,
      "DD-MM-YYYY",
    ).toISOString();

    const hashPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = {
      ...data,
      password: hashPassword,
      birthDate: formattedBirthDate,
    };

    const newUser = await this.userDataSource.create({
      data: user,
    });

    return {
      ...newUser,
      birthDate: dayjs(newUser.birthDate).format("DD-MM-YYYY"),
    };
  }
}
