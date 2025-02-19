import { CustomError } from "../../../domain/errors/index.js";
import { checkAuthentication } from "../../../core/utils/check-authentication.js";
import {
  CreateUserUseCase,
  LoginUserUseCase,
  FindUserByIDUseCase,
  SearchListUsersUseCase,
} from "../../../domain/use-cases/user/index.js";
import { Mutation, Query, Resolver, Arg, Ctx, Int } from "type-graphql";
import { CreateUserInput, LoginUserInput } from "./inputs/index.js";
import { ListUsers, UserToken, User } from "./types/index.js";
import { Context } from "../../context.interface.js";
import { UserDBDataSource } from "../../../data/user/user.db.datasource.js";

@Resolver()
export class UserResolver {
  private findUserByIDUseCase: FindUserByIDUseCase;
  private createUserUseCase: CreateUserUseCase;
  private loginUserUseCase: LoginUserUseCase;
  private searchListUsersUseCase: SearchListUsersUseCase;

  constructor() {
    this.findUserByIDUseCase = new FindUserByIDUseCase(
      UserDBDataSource.getInstance(),
    );
    this.createUserUseCase = new CreateUserUseCase(
      UserDBDataSource.getInstance(),
    );
    this.loginUserUseCase = new LoginUserUseCase(
      UserDBDataSource.getInstance(),
    );
    this.searchListUsersUseCase = new SearchListUsersUseCase(
      UserDBDataSource.getInstance(),
    );
  }

  @Mutation(() => User)
  async createUser(
    @Arg("data", () => CreateUserInput) data: CreateUserInput,
    @Ctx() context: Context,
  ): Promise<User> {
    try {
      checkAuthentication({ context });
      return await this.createUserUseCase.run({ data });
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
      return await this.loginUserUseCase.run({
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
    @Ctx() context: Context,
  ): Promise<User> {
    try {
      checkAuthentication({ context });

      return await this.findUserByIDUseCase.run({
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
    @Arg("skip", () => Int, { defaultValue: 0 }) skip: number,
    @Arg("quantity", () => Int, { defaultValue: 10 }) quantity: number,
    @Ctx() context: Context,
  ): Promise<ListUsers> {
    try {
      checkAuthentication({ context });

      return await this.searchListUsersUseCase.run({
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
