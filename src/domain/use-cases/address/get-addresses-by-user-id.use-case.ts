import { NotFoundError } from "../../errors/index.js";
import {
  UserDataSourceModel,
  AddressDataSourceModel,
  AddressModel,
} from "../../models/index.js";

export class GetAddressesByUserIDUseCase {
  private userDataSource: UserDataSourceModel;
  private addressDataSource: AddressDataSourceModel;

  constructor(
    userDataSource: UserDataSourceModel,
    addressDataSource: AddressDataSourceModel,
  ) {
    this.userDataSource = userDataSource;
    this.addressDataSource = addressDataSource;
  }

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
