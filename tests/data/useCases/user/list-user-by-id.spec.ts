import { ListUserByIdRepository } from "@/data/protocols/user";
import { ListUserByIdAdapter } from "@/data/useCases/user";
import { User } from "@/domain/models/user";

const id = "valid_id";

const USER: User = {
  id,
  name: "valid_name",
  email: "valid_email@example.com"
};

const makeListUserByIdRepositoryStub = (): ListUserByIdRepository => {
  class ListUserByIdRepositoryStub implements ListUserByIdRepository {
    handle(_id: string): Promise<User> {
      return new Promise(resolve => resolve(USER));
    }
  }

  return new ListUserByIdRepositoryStub();
};

interface SutTypes {
  sut: ListUserByIdAdapter;
  listUserByIdRepositoryStub: ListUserByIdRepository;
}

const makeSut = (): SutTypes => {
  const listUserByIdRepositoryStub = makeListUserByIdRepositoryStub();
  const sut = new ListUserByIdAdapter(listUserByIdRepositoryStub);

  return {
    sut,
    listUserByIdRepositoryStub
  };
};

describe("ListUserByIdAdapter", () => {
  it("Should call ListUserByIdRepository with the id", async () => {
    const { sut, listUserByIdRepositoryStub } = makeSut();

    const ListUserByIdSpy = jest.spyOn(listUserByIdRepositoryStub, "handle");
    await sut.handle(id);

    expect(ListUserByIdSpy).toHaveBeenCalledWith(id);
  });

  it("Should throw if ListUserByIdRepository throws", async () => {
    const { sut, listUserByIdRepositoryStub } = makeSut();

    jest.spyOn(listUserByIdRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.handle(id);

    expect(promise).rejects.toThrow();
  });

  it("Should return the right user on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(id);

    expect(response).toEqual(USER);
  });

  it("Should return null if no user was find", async () => {
    const { sut, listUserByIdRepositoryStub } = makeSut();

    jest.spyOn(listUserByIdRepositoryStub, "handle").mockReturnValueOnce(null);
    const response = await sut.handle(id);

    expect(response).toEqual(null);
  });
});
