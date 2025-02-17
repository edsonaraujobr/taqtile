import { UnauthorizedUser } from "../../domain/errors/index.js";
import { ContextInput } from "../../api/context.interface.js";

export function checkAuthentication({ context }: { context: ContextInput }) {
  if (!context?.user) {
    throw new UnauthorizedUser({ message: "Usuário não autorizado" });
  }
}
