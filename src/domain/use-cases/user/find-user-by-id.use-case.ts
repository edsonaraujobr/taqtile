import { UserDBDataSource } from "../../../data/user/user.db.datasource.js";
import dayjs from "dayjs";
import { NotFoundError } from "../../errors/index.js";
import { UserModel } from "../../models/index.js";

export class FindUserByIDUseCase {
  static async run({ id }: { id: string }): Promise<UserModel> {
    const user = await UserDBDataSource.findByID({ id });

    if (!user) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }

    return {
      ...user,
      birthDate: dayjs(user.birthDate).format("DD-MM-YYYY"),
    };
  }
}
