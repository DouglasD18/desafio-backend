import { ListUserById, Validator } from "../../..//domain/useCases/user";
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
    const { userId } = httpRequest.params;
    const body = httpRequest.body;
    const payload = { ...body, userId }

    const validated = this.validator.handle(payload);
    if (!validated.isValid) {
      return badRequest(validated.message!)
    }

    try {
      const user = await this.listUserById.handle(userId);
      if (!user) {
        return notFound("Usuário não encontrado");
      }

      const { id } = await this.createTask.handle(payload);
      return created(id);
    } catch (error: unknown) { 
      if (error instanceof Error) { 
        return internalServerError(error.message);
      }
      
      return internalServerError("Erro desconhecido");
    }
  }
  
}
