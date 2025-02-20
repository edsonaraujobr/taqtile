import { Field, InputType } from "type-graphql";
import { CreateAddressModel } from "../../../../domain/models/address.model";

@InputType()
export class AddressInput implements CreateAddressModel {
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
