import { UnauthorizedUser } from "../../domain/errors/index";
import { Context } from "../../api/context.interface";

export function checkAuthentication({ context }: { context: Context }) {
  if (!context?.user) {
    throw new UnauthorizedUser({ message: "Usuário não autorizado" });
  }
}
