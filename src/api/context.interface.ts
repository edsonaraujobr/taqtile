export interface Context {
  user?: DecodedToken;
  code?: string;
  message?: string;
  additionalInfo?: string;
}

export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
