import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { REMEMBER_ME_EXPIRATION, DEFAULT_EXPIRATION } from "../utils/constants";
import {
  MissingSecretKeyError,
  UnauthorizedUser,
} from "../../domain/errors";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export function isJwtPayload(decodedToken: any): decodedToken is JwtPayload {
  return decodedToken && typeof decodedToken === 'object' && 'exp' in decodedToken;
}

export class JwtService {
  static generateToken(payload: object, rememberMe: boolean = false) {
    if (!SECRET_KEY) {
      throw new MissingSecretKeyError();
    }
    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: rememberMe ? REMEMBER_ME_EXPIRATION : DEFAULT_EXPIRATION,
    });
  }

  static decodeToken(token: string): JwtPayload | string {
    if (!SECRET_KEY) {
      throw new MissingSecretKeyError();
    }
    return jwt.decode(token);
  }

  static verifyToken(token: string) {
    if (!SECRET_KEY) {
      throw new MissingSecretKeyError();
    }
    try {
      const result = jwt.verify(token, SECRET_KEY);
      return result;
    } catch (error) {
      throw new UnauthorizedUser({
        message: "Token de validação expirado ou inválido!",
      });
    }
  }
}
