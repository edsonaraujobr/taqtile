import { Field, ObjectType } from "type-graphql";
import { User } from "./user.type";
import { ListUsersModel } from "../../../../domain/models/user.model";

@ObjectType()
export class ListUsers implements ListUsersModel {
  @Field(() => [User])
  users!: User[];

  @Field(() => Number)
  totalUsers!: number;

  @Field(() => Boolean)
  hasPreviousPage!: boolean;

  @Field(() => Boolean)
  hasNextPage!: boolean;
}
