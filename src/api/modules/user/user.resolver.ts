import { CustomError } from "../../../core/errors/import-all-errors.js";
import { checkAuthentication } from "../../../core/utils/check-authentication.js";
import { CreateUser, LoginUser, UserWithFormattedDate } from "./user.types.js";
import { Context } from "../context.types.js";
import { CreateUserUseCase } from "../../../domain/user/create-user.use-case.js";
import { LoginUserUseCase } from "../../../domain/user/login-user.use-case.js";
import { FindUserByIDUseCase } from "../../../domain/user/find-user-by-id.use-case.js";
import { SearchListUsersUseCase } from "../../../domain/user/search-list-users.use-case.js";
import { Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class userResolver {
  @Mutation(() => UserWithFormattedDate)
  async createUser(
    _,
    { data }: { data: CreateUser },
    context: Context,
  ): Promise<UserWithFormattedDate> {
    try {
      checkAuthentication({ context });
      return await CreateUserUseCase.run({ data });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        code: 500,
        message: "Erro inesperado no servidor.",
      });
    }
  }

  async loginUser (_, { data }: { data: LoginUser }) {
    try {
      return await LoginUserUseCase.run({
        data,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        code: 500,
        message: "Erro inesperado no servidor.",
      });
    }
  }

  @Query()
  async findUserByID (_, { id }: { id: string }, context: Context) {
    try {
      checkAuthentication({ context });

      return await FindUserByIDUseCase.run({
        id,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        code: 500,
        message: "Erro inesperado no servidor.",
      });
    }
  }

  @Query()
  async listUsers(
    _,
    {
      skip,
      quantity,
    }: {
      skip: number;
      quantity: number;
    },
    context: Context,
  ) {
    try {
      checkAuthentication({ context });

      return await SearchListUsersUseCase.run({
        skip,
        quantity,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        code: 500,
        message: "Erro inesperado no servidor.",
      });
    }
  }
}
