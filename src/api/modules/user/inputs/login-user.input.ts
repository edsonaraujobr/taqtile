import { Field, InputType } from "type-graphql";
import { LoginUserInputModel } from "../../../../domain/models/user.model.js";

@InputType()
export class LoginUserInput implements LoginUserInputModel {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Boolean, { nullable: true })
  rememberMe?: boolean;
}
