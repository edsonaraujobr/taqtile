import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {
  REMEMBER_ME_EXPIRATION,
  DEFAULT_EXPIRATION,
} from "../utils/constants.js";
import { MissingSecretKeyError } from "../errors/missingSecretKeyError.js";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export class JwtService {
  static generateToken(payload: object, rememberMe: boolean = false) {
    if (!SECRET_KEY) {
      throw new MissingSecretKeyError();
    }
    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: rememberMe ? REMEMBER_ME_EXPIRATION : DEFAULT_EXPIRATION,
    });
  }

  static decodeToken(token: string) {
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
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error("Token inválido ou expirado");
    }
  }
}
