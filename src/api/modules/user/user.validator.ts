import dayjs from "dayjs";
import z from "zod";
import { FORMAT_DATE_REGEX } from "../../../core/utils/constants";

export const userCreateValidator = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .email("Email inválido! Seu email precisa de um @ e um domínio"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres!")
    .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
    .regex(/\d/, "A senha deve conter pelo menos um dígito"),
  birthDate: z
    .string()
    .optional()
    .refine(
      (date) =>
        !date ||
        (FORMAT_DATE_REGEX.test(date) && dayjs(date, "DD-MM-YYYY", true).isValid()),
      "Formato de data inválido. Use o formato DD-MM-YYYY.",
    ),
});
