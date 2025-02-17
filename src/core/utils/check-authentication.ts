import { UnauthorizedUser } from "../errors/index.js";
import { ContextInput } from "../../api/context.input.js";

export function checkAuthentication({ context }: { context: ContextInput }) {
  if (!context?.user) {
    throw new UnauthorizedUser({ message: "Usuário não autorizado" });
  }
}
