import { UserDBDataSource } from "@data/user/user.db.datasource";
import { NotFoundError } from "@domain/errors";
import { JwtService } from "@core/jwt/jwt-service";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { LoginUserModel, LoginUserInputModel } from "@domain/models";
import { Service } from "typedi";

@Service()
export class LoginUserUseCase {
  constructor(private readonly userDBDataSource: UserDBDataSource) {}

  async run({ data }: { data: LoginUserInputModel }): Promise<LoginUserModel> {
    const user = await this.userDBDataSource.findByEmail({
      email: data.email,
    });

    if (!user) {
      throw new NotFoundError({
        message: "Usuário não encontrado. Verifique seu email e senha",
      });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundError({
        message: "Usuário não encontrado. Verifique seu email e senha",
      });
    }

    const token = JwtService.generateToken({ id: user.id }, data.rememberMe);

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
}
