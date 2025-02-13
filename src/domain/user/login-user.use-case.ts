import { UserDBDataSource } from "../../data/user/user.db.datasource.js";
import {
  LoginUser,
  UserWithTokenAuthentication,
} from "../../api/modules/user/user.types.js";
import { NotFoundError } from "../../core/errors/importAllErrors.js";
import { JwtService } from "../../core/jwt/jwtService.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

export class LoginUserUseCase {
  static async run({
    data,
  }: {
    data: LoginUser;
  }): Promise<UserWithTokenAuthentication> {
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
