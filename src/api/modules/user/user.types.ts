import { User } from "@prisma/client";
import { Address } from "../address/address.types.js";

export interface ListUsersResult {
  users: User[];
  totalUsers: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserWithFormattedDate {
  name: string | null;
  id: string;
  email: string;
  birthDate: Date | string | null;
  addresses: Address[];
}

export interface UserCreated {
  name: string | null;
  id: string;
  email: string;
  birthDate: Date | string | null;
}

export interface UserWithTokenAuthentication {
  user: UserCreated;
  token: string;
}

export interface LoginUser {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  birthDate: string | null;
}
