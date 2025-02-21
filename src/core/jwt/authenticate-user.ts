import { JwtService } from "./jwt-service";
import { UnauthorizedUser } from "@domain/errors";

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
