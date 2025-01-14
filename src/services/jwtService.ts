import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { REMEMBER_ME_EXPIRATION, DEFAULT_EXPIRATION } from "../utils/constants.js";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export class JwtService {
  static generateToken(payload: object, rememberMe: boolean = false) {
    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: rememberMe ? REMEMBER_ME_EXPIRATION : DEFAULT_EXPIRATION,
    });
  }

  static decodeToken(token: string) {
    return jwt.decode(token);
  }

  static verifyToken(token: string) {
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY não está definido no arquivo .env");
    }
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error("Token inválido ou expirado");
    }
  }
}
