import { ListUsersRepository } from "@/data/protocols/user";
import { ListUsersAdapter } from "@/data/useCases/user";
import { ListUsersResponse } from "@/domain/models/user";

const LIST_USERS_RESPONSE: ListUsersResponse = [{
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@example.com"
}];

const makeListUsersRepositoryStub = (): ListUsersRepository => {
  class ListUsersRepositoryStub implements ListUsersRepository {
    handle(): Promise<ListUsersResponse> {
      return new Promise(resolve => resolve(LIST_USERS_RESPONSE));
    }
  }

  return new ListUsersRepositoryStub();
};

interface SutTypes {
  sut: ListUsersAdapter;
  listUsersRepositoryStub: ListUsersRepository;
}

const makeSut = (): SutTypes => {
  const listUsersRepositoryStub = makeListUsersRepositoryStub();
  const sut = new ListUsersAdapter(listUsersRepositoryStub);

  return {
    sut,
    listUsersRepositoryStub
  };
};

describe("ListUsersAdapter", () => {
  it("Should call ListUsersRepository ", async () => {
    const { sut, listUsersRepositoryStub } = makeSut();

    const ListUsersSpy = jest.spyOn(listUsersRepositoryStub, "handle");
    await sut.handle();

    expect(ListUsersSpy).toHaveBeenCalled();
  });

  it("Should throw if listUsersRepository throws", async () => {
    const { sut, listUsersRepositoryStub } = makeSut();

    jest.spyOn(listUsersRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle();

    expect(promise).rejects.toThrow();
  });

  it("Should return a valid id on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle();

    expect(response).toEqual(LIST_USERS_RESPONSE);
  });
});
