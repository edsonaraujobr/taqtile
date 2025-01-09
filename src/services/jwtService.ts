import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export class JwtService {
  static generateToken(payload: object) {
    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1h",
    });
  }
}
