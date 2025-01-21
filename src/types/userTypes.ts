import { User } from "@prisma/client";
import { Address } from "@prisma/client";
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
  birthDate: string | null;
  addresses: Address[];
}

export interface UserWithTokenAuthentication {
  user: UserWithFormattedDate;
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
