import { ListTasks } from "../../../domain/useCases/task";
import { ok, internalServerError } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class ListTasksController implements Controller {
  private readonly listTasks: ListTasks;

  constructor(listTasks: ListTasks) {
    this.listTasks = listTasks;
  }

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const tasks = await this.listTasks.handle();
      return ok(tasks);
    } catch (error: unknown) { 
      if (error instanceof Error) { 
        return internalServerError(error.message);
      }
      
      return internalServerError("Erro desconhecido");
    }
  }
  
}
