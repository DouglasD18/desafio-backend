import { Validator } from "../../../domain/useCases/validator";
import { ListTaskByUser } from "../../../domain/useCases/user";
import { badRequest, internalServerError, ok, notFound } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class ListTasksByUserController implements Controller {
  private readonly listTaskByUser: ListTaskByUser;
  private readonly validator: Validator;

  constructor(listTaskByUser: ListTaskByUser, validator: Validator) {
    this.listTaskByUser = listTaskByUser;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const id = httpRequest.params.id;
    
    const validated = this.validator.handle({ id });
    if (!validated.isValid) {
      return badRequest(validated.message!)
    }

    try {
      const tasks = await this.listTaskByUser.handle(id);
      return ok(tasks);
    } catch (error: unknown) { 
      if (error instanceof Error && error.message === "Usuário não encontrado") {
        return notFound(error.message);
      }

      if (error instanceof Error) { 
        return internalServerError(error.message);
      }
      
      return internalServerError("Erro desconhecido");
    }
  }
  
}
