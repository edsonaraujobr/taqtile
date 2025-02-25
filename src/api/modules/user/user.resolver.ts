import { CustomError } from "@domain/errors";
import { checkAuthentication } from "@core/utils/check-authentication";
import {
  CreateUserUseCase,
  LoginUserUseCase,
  FindUserByIDUseCase,
  SearchListUsersUseCase,
} from "@domain/use-cases/user";
import { Mutation, Query, Resolver, Arg, Ctx, Int } from "type-graphql";
import { CreateUserInput, LoginUserInput } from "./inputs";
import { ListUsers, UserToken, User } from "./types";
import { Context } from "@api/context.interface";
import { Service } from "typedi";
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";
import { UploadFileUseCase } from "@domain/use-cases/user/upload-file.use-case";

@Service()
@Resolver()
export class UserResolver {
  constructor(
    private readonly findUserByIDUseCase: FindUserByIDUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly searchListUsersUseCase: SearchListUsersUseCase,
    private readonly uploadFileUseCase: UploadFileUseCase,
  ) {}

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

  @Mutation(() => String)
  async uploadFile(
    @Arg("file", () => GraphQLUpload) file: FileUpload,
  ): Promise<string> {
    try {
      return await this.uploadFileUseCase.run({ file });
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
