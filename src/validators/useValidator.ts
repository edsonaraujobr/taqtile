import z from "zod";

export const userValidator = z.object({
  name: z.string().optional(),
  email: z.string().email("Email inválido!"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres!")
    .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
    .regex(/\d/, "A senha deve conter pelo menos um dígito"),
  birthDate: z.string().optional(),
});
