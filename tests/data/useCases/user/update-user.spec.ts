import { UpdateUserAdapter } from "@/data/useCases/user";
import { UpdateUserRepository } from "@/data/protocols/user";
import { UpdateUserPayload } from "@/domain/models/user";

const PAYLOAD = {
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@example.com",
  password: "new_password"
}

const makeUpdateUserRepositoryStub = (): UpdateUserRepository => {
  class UpdateUserRepositoryStub implements UpdateUserRepository {
    async handle(data: UpdateUserPayload): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }
  return new UpdateUserRepositoryStub();
};

interface SutTypes {
  sut: UpdateUserAdapter;
  updateUserRepositoryStub: UpdateUserRepository;
}

const makeSut = (): SutTypes => {
  const updateUserRepositoryStub = makeUpdateUserRepositoryStub();
  const sut = new UpdateUserAdapter(updateUserRepositoryStub);
  return {
    sut,
    updateUserRepositoryStub,
  };
};

describe("UpdateUserAdapter", () => {
  it("should call UpdateUserRepository if the user is found", async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    const updateUserSpy = jest.spyOn(updateUserRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(updateUserSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it("should throw an error if UpdateUserRepository throws", async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    jest.spyOn(updateUserRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  });

  it("should return false if UpdateUserRepository returns false", async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    jest.spyOn(updateUserRepositoryStub, "handle").mockImplementationOnce(() => {
      return new Promise(resolve => resolve(false));
    });
    const result = await sut.handle(PAYLOAD);

    expect(result).toEqual(false);
  });

  it("should return true on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(PAYLOAD);

    expect(result).toEqual(true); 
  });
});
