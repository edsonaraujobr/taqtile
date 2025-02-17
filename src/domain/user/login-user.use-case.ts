import { UserDBDataSource } from "../../data/user/user.db.datasource.js";
import { NotFoundError } from "../../core/errors/index.js";
import { JwtService } from "../../core/jwt/jwt-service.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { UserToken } from "../../api/modules/user/types/index.js";
import { LoginUserInput } from "../../api/modules/user/inputs/index.js";

export class LoginUserUseCase {
  static async run({ data }: { data: LoginUserInput }): Promise<UserToken> {
    const user = await UserDBDataSource.findByEmail({
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
