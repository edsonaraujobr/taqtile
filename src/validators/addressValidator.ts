import z from "zod";

export const addressCreateValidator = z.object({
  cep: z.string(),
  street: z.string(),
  streetNumber: z.number(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  userId: z.string(),
});
