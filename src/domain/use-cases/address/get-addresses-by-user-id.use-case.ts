import { NotFoundError } from "../../errors/index.js";
import { AddressDBDataSource } from "../../../data/address/address.db.datasource.js";
import { UserDBDataSource } from "../../../data/user/user.db.datasource.js";
import { AddressModel } from "../../models/index.js";

export class GetAddressesByUserIDUseCase {
  static async run({ userId }: { userId: string }): Promise<AddressModel[]> {
    const user = await UserDBDataSource.findByID({ id: userId });

    if (!user) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }
    const addresses = await AddressDBDataSource.findManyByID({ id: userId });

    if (addresses.length === 0) {
      return [];
    }

    return addresses;
  }
}
