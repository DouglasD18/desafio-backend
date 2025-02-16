import { z } from "zod";
import { Validated } from "../../domain/models/user";
import { Validator } from "../../domain/useCases/user";

export class UpdateUserZodValidator implements Validator {
  private schema = z.object({
    id: z.string().uuid("Id inválido"),
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(120, "O nome pode ter no máximo 120 caracteres").optional(),
    email: z.string().email("E-mail inválido").optional(),
    password: z.string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial")
      .optional(),
  });

  handle(body: any): Validated {
    const result = this.schema.safeParse(body);

    if (!result.success) {
      return {
        isValid: false,
        message: result.error.errors.map((err) => err.message).join(", "),
      };
    }

    return { isValid: true };
  }
}
