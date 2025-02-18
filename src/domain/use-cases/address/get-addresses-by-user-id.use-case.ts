import { Service } from "typedi";
import { NotFoundError } from "../../errors/index.js";
import { AddressModel } from "../../models/index.js";
import { UserDBDataSource } from "../../../data/user/user.db.datasource.js";
import { AddressDBDataSource } from "../../../data/address/address.db.datasource.js";

@Service()
export class GetAddressesByUserIDUseCase {
  constructor(
    private readonly userDataSource: UserDBDataSource,
    private readonly addressDataSource: AddressDBDataSource,
  ) {}

  async run({ userId }: { userId: string }): Promise<AddressModel[]> {
    const user = await this.userDataSource.findByID({ id: userId });

    if (!user) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }
    const addresses = await this.addressDataSource.findManyByID({ id: userId });

    if (addresses.length === 0) {
      return [];
    }

    return addresses;
  }
}
