import { Field, ObjectType } from "type-graphql";
import { User } from "./user.type.js";
import { LoginUserModel } from "../../../../domain/models/user.model.js";

@ObjectType()
export class UserToken implements LoginUserModel {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}
