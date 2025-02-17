import { User } from "@prisma/client";
import { database } from "../database/database.js";
import {
  CreateUser,
  UserWithFormattedDate,
} from "../../api/modules/user/user.types.js";

export class UserDBDataSource {
  static async create({ data }: { data: CreateUser }): Promise<User> {
    return database.user.create({ data });
  }

  static async findByEmail({ email }: { email: string }): Promise<User | null> {
    return database.user.findUnique({
      where: { email },
      include: {
        addresses: true,
      },
    });
  }

  static async findByID({
    id,
  }: {
    id: string;
  }): Promise<UserWithFormattedDate | null> {
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
