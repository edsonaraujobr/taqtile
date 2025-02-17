import { Field, InputType } from "type-graphql";
import { DecodedToken } from "./modules/user/types/decoded-token.types.js";

@InputType()
export class ContextInput {
  @Field(() => DecodedToken, { nullable: true })
  user?: DecodedToken;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  additionalInfo?: string;
}
