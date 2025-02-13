import { JwtService } from "./jwtService.js";
import { UnauthorizedUser } from "../errors/importAllErrors.js";

export const authenticate = (token: string) => {
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
