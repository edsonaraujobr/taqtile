import { Field, ObjectType } from "type-graphql";
import { User } from "./user.type.js";

@ObjectType()
export class UserToken {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}
