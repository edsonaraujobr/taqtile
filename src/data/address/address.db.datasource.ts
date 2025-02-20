import { Service } from "typedi";
import { AddressModel, CreateAddressModel } from "@domain/models";
import { database } from "@data/database/database";

@Service()
export class AddressDBDataSource {
  async create({ data }: { data: CreateAddressModel }): Promise<AddressModel> {
    return await database.address.create({ data });
  }

  async findManyByID({ id }: { id: string }): Promise<AddressModel[]> {
    return await database.address.findMany({
      where: { userId: id },
    });
  }
}
