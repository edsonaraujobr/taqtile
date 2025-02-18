import dayjs from "dayjs";
import { NotFoundError } from "../../errors/index.js";
import { UserDataSourceModel, UserModel } from "../../models/index.js";

export class FindUserByIDUseCase {
  private userDataSource: UserDataSourceModel;

  constructor(userDataSource: UserDataSourceModel) {
    this.userDataSource = userDataSource;
  }

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
