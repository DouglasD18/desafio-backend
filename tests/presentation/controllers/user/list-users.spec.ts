import { ListUsersResponse } from "@/domain/models/user";
import { ListUsers } from "@/domain/useCases/user";
import { ListUsersController } from "@/presentation/controllers/user/list-users";
import { InternalServerError } from "@/presentation/errors";
import { HttpRequest } from "@/presentation/protocols";

const _httpResponse: HttpRequest = {}

const USERS: ListUsersResponse = [{
  id: "any_id",
  name: "any_name",
  email: "any_email"
}]

interface SutTypes {
  sut: ListUsersController
  listUsersStub: ListUsers
}

const makeListUsersStub = (): ListUsers => {
  class ListUsersStub implements ListUsers {
    handle(): Promise<ListUsersResponse> {
      return new Promise(resolve => resolve(USERS));
    }
  }

  return new ListUsersStub();
}

const makeSut = (): SutTypes => {
  const listUsersStub = makeListUsersStub();
  const sut = new ListUsersController(listUsersStub);

  return {
    sut,
    listUsersStub
  }
}

describe('ListUsersController', () => {
  it("Should call ListUsers", async () => {
    const { sut, listUsersStub } = makeSut();

    const ListUsersSpy = jest.spyOn(listUsersStub, "handle");
    await sut.handle(_httpResponse);

    expect(ListUsersSpy).toHaveBeenCalled();
  });

  it('Should return 500 if ListUsers throws', async () => {
    const { sut, listUsersStub } = makeSut();

    jest.spyOn(listUsersStub, "handle").mockImplementation(() => {
      throw new Error("Erro interno");
    })
    const httpResponse = await sut.handle(_httpResponse);

    expect(httpResponse.body).toEqual(new InternalServerError("Erro interno"));
    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 200 when work right.', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(_httpResponse);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(USERS);
  });
});