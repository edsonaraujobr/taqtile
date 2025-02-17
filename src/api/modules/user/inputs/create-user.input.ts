import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String,{ nullable: true })
  birthDate?: string;
}
