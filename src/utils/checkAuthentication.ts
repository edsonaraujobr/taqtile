import { UnauthorizedUser } from "../errors/unauthorizedUser.js";
import { Context } from "../types/contextTypes.js";

export function checkAuthentication({ context }: { context: Context }) {
  if (!context?.user) {
    throw new UnauthorizedUser({ message: "Usuário não autorizado" });
  }
}
