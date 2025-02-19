import { Field, InputType } from "type-graphql";
import { CreateUserModel } from "../../../../domain/models/user.model";

@InputType()
export class CreateUserInput implements CreateUserModel {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String, { nullable: true })
  birthDate?: string;
}
