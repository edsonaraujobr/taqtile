import { CustomError } from "../../../core/errors/index.js";
import { checkAuthentication } from "../../../core/utils/check-authentication.js";
import {
  CreateUserUseCase,
  LoginUserUseCase,
  FindUserByIDUseCase,
  SearchListUsersUseCase,
} from "../../../domain/user/index.js";
import { Mutation, Query, Resolver, Arg, Ctx } from "type-graphql";
import { CreateUserInput, LoginUserInput } from "./inputs/index.js";
import { ListUsers, UserToken, User } from "./types/index.js";
import { number } from "zod";
import { ContextInput } from "../../context.input.js";

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => CreateUserInput) data: CreateUserInput,
    @Ctx() context: ContextInput,
  ): Promise<User> {
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

  @Mutation(() => UserToken)
  async loginUser(
    @Arg("data", () => LoginUserInput) data: LoginUserInput,
  ): Promise<UserToken> {
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

  @Query(() => User)
  async findUserByID(
    @Arg("id", () => String) id: string,
    @Ctx() context: ContextInput,
  ): Promise<User> {
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

  @Query(() => ListUsers)
  async listUsers(
    @Arg("skip", () => Number, { defaultValue: 0 }) skip: number,
    @Arg("quantity", () => Number, { defaultValue: 10 }) quantity: number,
    @Ctx() context: ContextInput,
  ): Promise<ListUsers> {
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
