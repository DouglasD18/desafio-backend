import { UpdateUser, Validator } from "../../../domain/useCases/user";
import { badRequest, internalServerError, noContent, notFound } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class UpdateUserController implements Controller {
  private readonly updateUser: UpdateUser;
  private readonly validator: Validator;

  constructor(updateUser: UpdateUser, validator: Validator) {
    this.updateUser = updateUser;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const id = httpRequest.params.id;
    const body = httpRequest.body;
    const payload = { ...body, id };
    
    const validated = this.validator.handle(payload);
    if (!validated.isValid) {
      return badRequest(validated.message!)
    }

    try {
      const user = await this.updateUser.handle(payload);
      if (!user) {
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
