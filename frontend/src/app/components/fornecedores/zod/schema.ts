// schema.ts
import { z } from "zod";

export const fornecedorSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório.")
    .min(3, "O nome deve ter ao menos 3 caracteres."),
  cnpj: z
    .string()
    .transform((v) => v.replace(/\D+/g, ""))
    .refine((v) => v.length === 14, {
      message: "O CNPJ deve conter 14 dígitos.",
    })
    .refine(
      (v) => {
        if (/^(\d)\1{13}$/.test(v)) return false;
        const n = v.split("").map(Number);
        const calc = (a: number[], p: number[]) => {
          const s = a.reduce((acc, nn, i) => acc + nn * p[i], 0);
          const r = s % 11;
          return r < 2 ? 0 : 11 - r;
        };
        const dv1 = calc(n.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        const dv2 = calc(
          n.slice(0, 13),
          [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        );
        return dv1 === n[12] && dv2 === n[13];
      },
      { message: "CNPJ inválido." }
    ),

  email: z
    .string()
    .trim()
    .email("Email inválido.")
    .max(255, "Email muito longo.")
    .optional()
    .or(z.literal("")),
});

export type FornecedorForm = z.input<typeof fornecedorSchema>;
export type FornecedorPayload = z.output<typeof fornecedorSchema>;
