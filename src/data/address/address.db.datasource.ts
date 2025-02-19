import { AddressModel, CreateAddressModel } from "../../domain/models/index.js";
import { database } from "../database/database.js";

export class AddressDBDataSource {
  static async create({
    data,
  }: {
    data: CreateAddressModel;
  }): Promise<AddressModel> {
    return await database.address.create({ data });
  }

  static async findManyByID({ id }: { id: string }): Promise<AddressModel[]> {
    return await database.address.findMany({
      where: { userId: id },
    });
  }
}
