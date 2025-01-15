import { AuthenticationError } from "apollo-server";
import { JwtService } from "../services/jwtService.js";

export const authenticate = (token) => {
  if (!token || !token.startsWith("Bearer ")) {
    throw new AuthenticationError(
      "Para continuar, você deve fornecer um token de validação válido no formato 'Bearer <token>'!"
    );
  }

  try {
    const decoded = JwtService.verifyToken(token.replace("Bearer ", ""));
    return decoded;
  } catch (error) {
    throw new AuthenticationError("Token de validação expirado ou inválido!");
  }
};
