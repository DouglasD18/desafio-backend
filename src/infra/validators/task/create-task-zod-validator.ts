import { z } from "zod";
import { Validated } from "../../../domain/models/validated";
import { Validator } from "../../../domain/useCases/validator";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export class CreateTaskZodValidator implements Validator {
  private schema = z.object({
    userId: z.string().regex(objectIdRegex, "Id inválido"),
    title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }).max(120, { message: "O título pode ter no máximo 120 caracteres" }),
    description: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }).max(500, { message: "A descrição pode ter no máximo 500 caracteres" }),
    status: z.enum(["pendente", "em progresso", "concluída"], { message: "Status inválido" }),
  });

  handle(body: unknown): Validated {
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
