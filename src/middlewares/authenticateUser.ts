import { JwtService } from "../services/jwtService.js";
import { UnauthorizedUser } from "../errors/unauthorizedUser.js";

export const authenticate = (token) => {
  if (!token || !token.startsWith("Bearer ")) {
    throw new UnauthorizedUser({
      message:
        "Para continuar, você deve fornecer um token de validação válido no formato 'Bearer <token>'!",
    });
  }

  try {
    const decoded = JwtService.verifyToken(token.replace("Bearer ", ""));
    return decoded;
  } catch (error) {
    throw new UnauthorizedUser({
      message: "Token de validação expirado ou inválido!",
    });
  }
};
