import { Field, InputType } from "type-graphql";

@InputType
export class LoginUserInput {
  @Field()
  email: String!

  @Field()
  password: String!

  @Field()
  rememberMe: Boolean
}
