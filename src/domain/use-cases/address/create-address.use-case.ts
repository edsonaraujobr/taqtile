import {
  BadInputError,
  InternalServerError,
  NotFoundError,
} from "../../errors/index.js";
import { addressCreateValidator } from "../../../api/modules/address/address.validator.js";
import { ZodError } from "zod";
import {
  AddressDataSourceModel,
  AddressModel,
  CreateAddressModel,
  UserDataSourceModel,
} from "../../models/index.js";

export class CreateAddressUseCase {
  private addressDataSource: AddressDataSourceModel;
  private userDataSource: UserDataSourceModel;

  constructor(
    userDataSource: UserDataSourceModel,
    addressDataSource: AddressDataSourceModel,
  ) {
    this.addressDataSource = addressDataSource;
    this.userDataSource = userDataSource;
  }

  async run({ data }: { data: CreateAddressModel }): Promise<AddressModel> {
    try {
      addressCreateValidator.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadInputError({
          message: error.errors[0].message,
        });
      }
      throw new InternalServerError();
    }

    let userExists;
    try {
      userExists = await this.userDataSource.findByID({ id: data.userId });
    } catch (error) {
      throw new InternalServerError();
    }

    if (!userExists) {
      throw new NotFoundError({
        message: "Usuário não encontrado!",
      });
    }

    return this.addressDataSource.create({ data });
  }
}
