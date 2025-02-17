import { ObjectType, ID, Field } from "type-graphql";

@ObjectType()
export class Address {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  cep: string;

  @Field(() => String)
  street: string;

  @Field(() => Number)
  streetNumber: number;

  @Field(() => String, { nullable: true })
  complement?: string | null;

  @Field(() => String)
  neighborhood: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  state: string;

  @Field(() => String)
  userId: string;
}
