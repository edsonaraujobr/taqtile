import { UserWithFormattedDate } from "../../api/modules/user/user.types.js";
import { UserDBDataSource } from "../../data/user/user.db.datasource.js";
import dayjs from "dayjs";
import { NotFoundError } from "../../core/errors/import-all-errors.js";

export class FindUserByIDUseCase {
  static async run({ id }: { id: string }): Promise<UserWithFormattedDate> {
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
