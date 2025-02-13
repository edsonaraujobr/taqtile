import { UnauthorizedUser } from "../errors/importAllErrors.js";
import { Context } from "../../api/modules/context.types.js";

export function checkAuthentication({ context }: { context: Context }) {
  if (!context?.user) {
    throw new UnauthorizedUser({ message: "Usuário não autorizado" });
  }
}
