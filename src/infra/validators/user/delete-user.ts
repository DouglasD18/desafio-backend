import { z } from "zod";
import { Validated } from "../../../domain/models/validated";
import { Validator } from "../../../domain/useCases/validator";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export class DeleteUserZodValidator implements Validator {
  private schema = z.object({
    id: z.string().regex(objectIdRegex, "Id inválido")
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
