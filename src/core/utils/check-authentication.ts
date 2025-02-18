import { UnauthorizedUser } from "../../domain/errors/index.js";
import { Context } from "../../api/context.interface.js";

export function checkAuthentication({ context }: { context: Context }) {
  if (!context?.user) {
    throw new UnauthorizedUser({ message: "Usuário não autorizado" });
  }
}
