import { database } from "../database/database.js";
import { CreateUserInput } from "../../api/modules/user/inputs/index.js";
import { User } from "../../api/modules/user/types/index.js";

export class UserDBDataSource {
  static async create({ data }: { data: CreateUserInput }): Promise<User> {
    return await database.user.create({
      data,
      include: { addresses: true },
    });
  }

  static async findByEmail({ email }: { email: string }): Promise<User | null> {
    return database.user.findUnique({
      where: { email },
      include: {
        addresses: true,
      },
    });
  }

  static async findByID({ id }: { id: string }): Promise<User | null> {
    return database.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  }

  static async count(): Promise<number> {
    return database.user.count();
  }

  static async findMany({ skip, take }: { skip: number; take: number }) {
    return database.user.findMany({
      orderBy: { name: "asc" },
      skip,
      take,
      where: {
        email: {
          not: "admin@admin.com",
        },
      },
      include: {
        addresses: true,
      },
    });
  }
}
