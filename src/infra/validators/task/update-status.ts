import { z } from "zod";
import { Validated } from "../../../domain/models/validated";
import { Validator } from "../../../domain/useCases/validator";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export class UpdateStatusZodValidator implements Validator {
  private schema = z.object({
    userId: z.string().regex(objectIdRegex, "Id inválido"),
    status: z.enum(["pendente", "em progresso", "concluída"], { message: "Status inválido" })
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
