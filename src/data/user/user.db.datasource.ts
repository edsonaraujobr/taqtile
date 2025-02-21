import { database } from "@data/database/database";
import { CreateUserModel, UserLoginReturnModel, UserModel } from "@domain/models/index";
import { Service } from "typedi";

@Service()
export class UserDBDataSource {
  private constructor() {}

  async create({ data }: { data: CreateUserModel }): Promise<UserModel> {
    return await database.user.create({
      data,
      include: { addresses: true },
    });
  }

  async findByEmail({
    email,
  }: {
    email: string;
  }): Promise<UserLoginReturnModel | null> {
    return await database.user.findUnique({
      where: { email },
      include: {
        addresses: true,
      },
    });
  }

  async findByID({ id }: { id: string }): Promise<UserModel | null> {
    return await database.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  }

  async count(): Promise<number> {
    return await database.user.count();
  }

  async findMany({
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
