import z from "zod";

export const addressCreateValidator = z.object({
  cep: z
    .string()
    .min(8, "Formato de CEP inválido. O formato correto é xxxxx-xxxx")
    .regex(
      /^\d{5}-\d{3}$/,
      "Formato de CEP inválido. O formato correto é xxxxx-xxxx",
    ),
  street: z.string().min(1, "Rua é obrigatório!"),
  streetNumber: z.number().int().positive("Número da rua deve ser positivo"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório!"),
  city: z.string().min(1, "Cidade é obrigatório!"),
  state: z.string().min(1, "Estado é obrigatório!"),
  userId: z.string().min(1, "ID do usuário é obrigatório!"),
});
