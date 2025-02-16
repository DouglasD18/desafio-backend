import { UpdateUserAdapter } from "@/data/useCases/user";
import { UpdateUserRepository, ListUsersRepository } from "@/data/protocols/user";
import { UpdateUserPayload, User } from "@/domain/models/user";

const VALID_USER: User = {
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@example.com",
};

const PAYLOAD = {
  ...VALID_USER,
  password: "new_password"
}

const makeUpdateUserRepositoryStub = (): UpdateUserRepository => {
  class UpdateUserRepositoryStub implements UpdateUserRepository {
    async handle(data: UpdateUserPayload): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  return new UpdateUserRepositoryStub();
};

const makeListUsersRepositoryStub = (): ListUsersRepository => {
  class ListUsersRepositoryStub implements ListUsersRepository {
    async handle(): Promise<User[]> {
      return new Promise(resolve => resolve([VALID_USER]));
    }
  }
  return new ListUsersRepositoryStub();
};

interface SutTypes {
  sut: UpdateUserAdapter;
  listUsersRepositoryStub: ListUsersRepository;
  updateUserRepositoryStub: UpdateUserRepository;
}

const makeSut = (): SutTypes => {
  const listUsersRepositoryStub = makeListUsersRepositoryStub();
  const updateUserRepositoryStub = makeUpdateUserRepositoryStub();
  const sut = new UpdateUserAdapter(updateUserRepositoryStub, listUsersRepositoryStub);
  return {
    sut,
    listUsersRepositoryStub,
    updateUserRepositoryStub,
  };
};

describe("UpdateUserAdapter", () => {
  it("should call ListUsersRepository", async () => {
    const { sut, listUsersRepositoryStub } = makeSut();

    const listUsersSpy = jest.spyOn(listUsersRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(listUsersSpy).toHaveBeenCalled();
  });

  it("should call UpdateUserRepository if the user is found", async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    const updateUserSpy = jest.spyOn(updateUserRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(updateUserSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it("should return undefined if user is not found", async () => {
    const { sut, listUsersRepositoryStub } = makeSut();
    jest.spyOn(listUsersRepositoryStub, "handle").mockResolvedValueOnce([]);
    const result = await sut.handle(PAYLOAD);
    expect(result).toBeUndefined(); 
  });

  it("should throw an error if ListUsersRepository throws", async () => {
    const { sut, listUsersRepositoryStub } = makeSut();

    jest.spyOn(listUsersRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  });

  it("should throw an error if UpdateUserRepository throws", async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    jest.spyOn(updateUserRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  });

  it("should return the user on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(PAYLOAD);

    expect(result).toEqual(VALID_USER); 
  });
});
