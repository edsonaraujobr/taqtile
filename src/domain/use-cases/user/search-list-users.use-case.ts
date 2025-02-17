import { UserDBDataSource } from "../../../data/user/user.db.datasource.js";
import { QUANTITY_DEFAULT_LIST_USERS } from "../../../core/utils/constants.js";
import { BadInputError, NotFoundError } from "../../errors/index.js";
import { ListUsersModel } from "../../models/index.js";

export class SearchListUsersUseCase {
  static async run({
    skip,
    quantity,
  }: {
    skip: number;
    quantity: number;
  }): Promise<ListUsersModel> {
    const totalUsers = await UserDBDataSource.count();

    const quantityUsers =
      Number.isInteger(quantity) && quantity > 0
        ? quantity
        : QUANTITY_DEFAULT_LIST_USERS;

    if (skip >= totalUsers) {
      throw new BadInputError({
        message:
          "O valor de skip excede o número total de usuários disponíveis.",
      });
    }

    const users = await UserDBDataSource.findMany({
      skip,
      take: quantityUsers,
    });

    if (users.length === 0) {
      throw new NotFoundError({
        message: "Nenhum usuário encontrado!",
      });
    }

    const hasPreviousPage = skip > 0;
    const hasNextPage = skip + quantityUsers < totalUsers;

    return {
      users,
      totalUsers,
      hasPreviousPage,
      hasNextPage,
    };
  }
}
