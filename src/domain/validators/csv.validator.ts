import { z } from "zod";
import { FORMAT_DATE_REGEX } from "@core/utils/constants";
import dayjs from "dayjs";
import { Service } from "typedi";
import { EmptyCSVError, InvalidCSVError } from "@domain/errors";
import { csvModel } from "@domain/models";

const rowSchema = z.object({
  name: z
    .string()
    .min(1, "O campo name é obrigatório e deve ser uma string."), 
  email: z.string().email("Email inválido! Seu email precisa de um @ e um domínio."),
  birthDate: z
    .string()
    .optional()
    .refine(
      (date) =>
        !date ||
        (FORMAT_DATE_REGEX.test(date) && dayjs(date, "DD-MM-YYYY", true).isValid()),
      "Formato de data inválido. Use o formato DD-MM-YYYY.",
    ),
  zipCode: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "O campo zipCode é obrigatório e deve ser uma string não vazia.",
    })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "O campo zipCode deve ser um número válido."),
  city: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "O campo city é obrigatório e deve ser uma string não vazia.",
    }),
  state: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "O campo state é obrigatório e deve ser uma string não vazia.",
    }),
  neighborhood: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "O campo neighborhood é obrigatório e deve ser uma string não vazia.",
    }),
  street: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "O campo street é obrigatório e deve ser uma string não vazia.",
    }),
  streetNumber: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "O campo streetNumber é obrigatório e deve ser uma string não vazia.",
    })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "O campo streetNumber deve ser um número válido."),
  complement: z.string().optional()
});

@Service()
export class CSVValidator {
  validate(csvData: csvModel[]): void {

    if (csvData.length === 0) {
      throw new EmptyCSVError({
        message: "O arquivo CSV está vazio ou inválido",
      });
    }

    const errors: string[] = []; 

    for (const [index, row] of csvData.entries()) {
      try {
        rowSchema.parse(row); 
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(`Erro na linha ${index + 1}: ${error.errors.map(e => e.message).join(", ")}`);
        }
      }
    }

    if (errors.length > 0) {
      throw new InvalidCSVError({
        message: errors.join("\n"),
      });
    }
  }
}
