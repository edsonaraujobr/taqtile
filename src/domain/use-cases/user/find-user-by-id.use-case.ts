import dayjs from "dayjs";
import { NotFoundError } from "../../errors/index";
import { UserModel } from "../../models/index";
import { Service } from "typedi";
import { UserDBDataSource } from "../../../data/user/user.db.datasource";

@Service()
export class FindUserByIDUseCase {
  constructor(private readonly userDataSource: UserDBDataSource) {}

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
