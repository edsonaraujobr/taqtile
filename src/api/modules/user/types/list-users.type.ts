import { Field, ObjectType } from "type-graphql";
import { User } from "./user.type.js";

@ObjectType()
export class ListUsers {
  @Field(() => [User])
  users: User[];

  @Field(() => Number)
  totalUsers: number;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => Boolean)
  hasNextPage: boolean;
}
