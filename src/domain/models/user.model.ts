import { AddressModel } from "./address.model.js";

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
