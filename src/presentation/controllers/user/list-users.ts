import { ListUsers } from "../../../domain/useCases/user";
import { ok, internalServerError } from "../../helpers/http";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class ListUsersController implements Controller {
  private readonly listUsers: ListUsers;

  constructor(listUsers: ListUsers) {
    this.listUsers = listUsers;
  }

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const users = await this.listUsers.handle();
      return ok(users);
    } catch (error: unknown) { 
      if (error instanceof Error) { 
        return internalServerError(error.message);
      }
      
      return internalServerError("Erro desconhecido");
    }
  }
  
}
