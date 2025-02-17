import { Validator } from "../../../domain/useCases/validator";
import { UpdateStatus } from "../../../domain/useCases/task";
import { badRequest, internalServerError, noContent, notFound } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class UpdateStatusController implements Controller {
  private readonly updateStatus: UpdateStatus;
  private readonly validator: Validator;

  constructor(updateStatus: UpdateStatus, validator: Validator) {
    this.updateStatus = updateStatus;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.params; 
    const { status } = httpRequest.body; 

    const validated = this.validator.handle({ id, status });
    if (!validated.isValid) {
      return badRequest(validated.message!);
    }

    try {
      const result = await this.updateStatus.handle({ id, status });
      if (!result) {
        return notFound("Tarefa não encontrada");
      }

      return noContent();
    } catch (error: unknown) { 
      if (error instanceof Error) { 
        return internalServerError(error.message);
      }
      
      return internalServerError("Erro desconhecido");
    }
  }
  
}
