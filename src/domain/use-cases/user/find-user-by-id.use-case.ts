import dayjs from "dayjs";
import { NotFoundError } from "../../errors/index.js";
import { UserModel } from "../../models/index.js";
import { Inject, Service } from "typedi";
import { UserDBDataSource } from "../../../data/user/user.db.datasource.js";

@Service()
export class FindUserByIDUseCase {
  constructor(@Inject() private userDataSource: UserDBDataSource) {}

  async run({ id }: { id: string }): Promise<UserModel> {
    const user = await this.userDataSource.findByID({ id });

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
