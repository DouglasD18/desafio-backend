import { Validator } from "../../../domain/useCases/validator";
import { DeleteTask } from "../../../domain/useCases/task";
import { badRequest, internalServerError, noContent, notFound } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class DeleteTaskController implements Controller {
  private readonly deleteTask: DeleteTask;
  private readonly validator: Validator;

  constructor(deleteTask: DeleteTask, validator: Validator) {
    this.deleteTask = deleteTask;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const id = httpRequest.params.id;
    
    const validated = this.validator.handle({ id });
    if (!validated.isValid) {
      return badRequest(validated.message!)
    }

    try {
      const result = await this.deleteTask.handle(id);
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
