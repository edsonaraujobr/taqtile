import { AuthenticationError } from "apollo-server";
import { JwtService } from "../services/jwtService.js";

export const authenticate = (context) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new AuthenticationError(
      "Para continuar, você deve fornecer um token de validação válido!",
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AuthenticationError("Formato do token de validação inválido! ");
  }

  try {
    const decoded = JwtService.verifyToken(token);
    return decoded;
  } catch (error) {
    throw new AuthenticationError("Token de validação expirado!");
  }
};
