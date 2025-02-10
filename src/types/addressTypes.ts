export interface Address {
  cep: string;
  street: string;
  streetNumber: number;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}

export interface AddressCreated {
  id: string;
  cep: string;
  street: string;
  streetNumber: number;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}

export interface Addresses {
  addresses: Address[];
}
