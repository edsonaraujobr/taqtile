import { UnauthorizedUser } from "../errors/unauthorizedUser.js";

export function checkAuthentication({ context }) {
  if (!context || !context.user) {
    throw new UnauthorizedUser({ message: "Usuário não autorizado" });
  }
}
