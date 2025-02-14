import { User } from "@prisma/client";
import { Address } from "../address/address.types.js";
import { Field, ID, ObjectType } from "type-graphql";
@ObjectType()
export class ListUsersResult {
  @Field(type => [User])
  users: User[];

  @Field()
  totalUsers: number;

  @Field()
  hasPreviousPage: boolean;

  @Field()
  hasNextPage: boolean;
}

@ObjectType()
export class UserWithFormattedDate {
  @Field()
  name: string | null;

  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  birthDate: Date | string | null;

  @Field()
  addresses: Address[];
}

@ObjectType()
export class UserCreated {
  @Field()
  name: string | null;

  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  birthDate: Date | string | null;
}

@ObjectType()
export class UserWithTokenAuthentication {
  @Field()
  user: UserCreated;

  @Field()
  token: string;
}

export interface LoginUser {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  rememberMe: boolean;

}
@ObjectType()
export class CreateUser {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  birthDate: string | null;
}
