interface DecodedToken {
  id: string;
  iat: number;
  export: number;
}

export interface Context {
  user?: DecodedToken;
  code?: string;
  message?: string;
  additionalInfo?: string;
}
