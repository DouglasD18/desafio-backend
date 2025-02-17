import { Validator } from "../../../domain/useCases/validator";
import { CreateUser } from "../../../domain/useCases/user";
import { badRequest, created, internalServerError } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class CreateUserController implements Controller {
  private readonly createUser: CreateUser;
  private readonly validator: Validator;

  constructor(createUser: CreateUser, validator: Validator) {
    this.createUser = createUser;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const body = httpRequest.body;
    const validated = this.validator.handle(body);
    if (!validated.isValid) {
      return badRequest(validated.message!)
    }

    try {
      const { id } = await this.createUser.handle(body);
      return created(id);
    } catch (error: unknown) { 
      if (error instanceof Error) { 
        return internalServerError(error.message);
      }
      
      return internalServerError("Erro desconhecido");
    }
  }
  
}
