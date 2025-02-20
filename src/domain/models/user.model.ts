import { AddressModel } from "./address.model";

export interface LoginUserModel {
  user: UserModel;
  token: string;
}

export interface LoginUserInputModel {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserModel {
  id: string;
  name?: string | null;
  email: string;
  birthDate?: string | Date | null;
  addresses?: AddressModel[];
}

export interface UserLoginReturnModel {
  id: string;
  name?: string | null;
  email: string;
  password: string;
  birthDate?: string | Date | null;
  addresses?: AddressModel[];
}

export interface ListUsersModel {
  users: UserModel[];
  totalUsers: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateUserModel {
  name?: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface UserDataSourceModel {
  findByID(params: { id: string }): Promise<UserModel | null>;
  findByEmail(params: { email: string }): Promise<UserModel | null>;
  create(params: { data: CreateUserModel }): Promise<UserModel>;
  findMany(params: { skip: number; take: number }): Promise<UserModel[]>;
  count(): Promise<number>;
}
