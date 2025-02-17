import { DecodedToken } from "./modules/user/types/decoded-token.types.js";

export interface Context {
  user?: DecodedToken;
  code?: string;
  message?: string;
  additionalInfo?: string;
}
