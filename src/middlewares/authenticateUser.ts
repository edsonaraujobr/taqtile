import { AuthenticationError } from "apollo-server";
import { JwtService } from "../services/jwtService.js";
import { BadInputError } from "../errors/badInputError.js";

export const authenticate = (token) => {
  if (!token) {
    throw new AuthenticationError(
      "Para continuar, você deve fornecer um token de validação válido!",
    );
  }

  if (!token) {
    throw new AuthenticationError("Formato do token de validação inválido! ");
  }

  try {
    const decoded = JwtService.verifyToken(token.replace("Bearer ", ""));
    return decoded; 
  } catch (error) {
    throw new AuthenticationError("Token de validação expirado!");
  }
};
