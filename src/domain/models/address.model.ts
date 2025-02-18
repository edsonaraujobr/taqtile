export interface AddressModel {
  id: string;
  cep: string;
  street: string;
  streetNumber: number;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}

export interface CreateAddressModel {
  cep: string;
  street: string;
  streetNumber: number;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}

export interface AddressDataSourceModel {
  findManyByID(params: { id: string }): Promise<AddressModel[]>;
  create(params: { data: CreateAddressModel }): Promise<AddressModel>;
}
