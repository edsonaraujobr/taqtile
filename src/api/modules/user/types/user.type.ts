import { Field, ID, ObjectType } from "type-graphql";
import { Address } from "../../address/types/address.type.js";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  birthDate?: string | null | Date;

  @Field(() => [Address], { nullable: true })
  addresses?: Address[];
}
