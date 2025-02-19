import { AddressModel, CreateAddressModel } from "../../domain/models/index.js";
import { database } from "../database/database.js";

export class AddressDBDataSource {
  private static instance: AddressDBDataSource;

  constructor() {}

  static getInstance(): AddressDBDataSource {
    if (!AddressDBDataSource.instance) {
      AddressDBDataSource.instance = new AddressDBDataSource();
    }
    return AddressDBDataSource.instance;
  }

  async create({ data }: { data: CreateAddressModel }): Promise<AddressModel> {
    return await database.address.create({ data });
  }

  async findManyByID({ id }: { id: string }): Promise<AddressModel[]> {
    return await database.address.findMany({
      where: { userId: id },
    });
  }
}
