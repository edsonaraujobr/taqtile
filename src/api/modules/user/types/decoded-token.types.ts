import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class DecodedToken {
  @Field(() => String)
  id: string;

  @Field(() => Number)
  iat: number;

  @Field(() => Number)
  exp: number;
}
