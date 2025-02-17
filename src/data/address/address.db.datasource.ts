import { AddressInput } from "../../api/modules/address/inputs/create-address.input.js";
import { Address } from "../../api/modules/address/types/index.js";
import { database } from "../database/database.js";

export class AddressDBDataSource {
  static async create({ data }: { data: AddressInput }): Promise<Address> {
    return await database.address.create({ data });
  }

  static async findManyByID({ id }: { id: string }): Promise<Address[]> {
    return await database.address.findMany({
      where: { userId: id },
    });
  }
}
