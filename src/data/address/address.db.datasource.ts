import { Address } from "@prisma/client";
import { database } from "../database/database.js";

export class AddressDBDataSource {
  static async create({ data }: { data: Address }) {
    return database.address.create({ data });
  }

  static async findManyByID({ id }: { id: string }) {
    return database.address.findMany({
      where: { userId: id },
    });
  }
}
