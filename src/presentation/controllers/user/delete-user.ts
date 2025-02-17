import { Validator } from "../../../domain/useCases/validator";
import { DeleteUser } from "../../../domain/useCases/user";
import { badRequest, internalServerError, noContent, notFound } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class DeleteUserController implements Controller {
  private readonly deleteUser: DeleteUser;
  private readonly validator: Validator;

  constructor(deleteUser: DeleteUser, validator: Validator) {
    this.deleteUser = deleteUser;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const id = httpRequest.params.id;
    
    const validated = this.validator.handle({ id });
    if (!validated.isValid) {
      return badRequest(validated.message!)
    }

    try {
      const result = await this.deleteUser.handle(id);
      if (!result) {
        return notFound("Usuário não encontrado");
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
