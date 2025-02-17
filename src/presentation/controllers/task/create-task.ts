import { Validator } from "../../../domain/useCases/validator";
import { ListUserById } from "../../../domain/useCases/user";
import { CreateTask } from "../../../domain/useCases/task";
import { badRequest, created, internalServerError, notFound } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class CreateTaskController implements Controller {
  private readonly createTask: CreateTask;
  private readonly listUserById: ListUserById;
  private readonly validator: Validator;

  constructor(createTask: CreateTask, validator: Validator, listUserById: ListUserById) {
    this.createTask = createTask;
    this.listUserById = listUserById;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const body = httpRequest.body;

    const validated = this.validator.handle(body);
    if (!validated.isValid) {
      return badRequest(validated.message!)
    }

    try {
      const user = await this.listUserById.handle(body.userId);
      if (!user) {
        return notFound("Usuário não encontrado");
      }

      const { id } = await this.createTask.handle(body);
      return created(id);
    } catch (error: unknown) { 
      if (error instanceof Error) { 
        return internalServerError(error.message);
      }
      
      return internalServerError("Erro desconhecido");
    }
  }
  
}
