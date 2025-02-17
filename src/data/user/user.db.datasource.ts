import { database } from "../database/database.js";
import { CreateUserModel, UserModel } from "../../domain/models/index.js";

export class UserDBDataSource {
  static async create({ data }: { data: CreateUserModel }): Promise<UserModel> {
    return await database.user.create({
      data,
      include: { addresses: true },
    });
  }

  static async findByEmail({
    email,
  }: {
    email: string;
  }): Promise<UserModel | null> {
    return await database.user.findUnique({
      where: { email },
      include: {
        addresses: true,
      },
    });
  }

  static async findByID({ id }: { id: string }): Promise<UserModel | null> {
    return await database.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  }

  static async count(): Promise<number> {
    return await database.user.count();
  }

  static async findMany({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }): Promise<UserModel[]> {
    return await database.user.findMany({
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
