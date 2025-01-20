import { JwtService } from "../services/jwtService.js";
import { UnauthorizedUser } from "../errors/unauthorizedUser.js";

export const authenticate = (token) => {
  if (!token || !token.startsWith("Bearer ")) {
    throw new UnauthorizedUser({
      message: "Usuário não autorizado!",
    });
  }

  try {
    const decoded = JwtService.verifyToken(token.replace("Bearer ", ""));
    return decoded;
  } catch (error) {
    throw new UnauthorizedUser({
      message: "Usuário não autorizado! Realize o login novamente.",
    });
  }
};
