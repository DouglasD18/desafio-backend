import { CreateUserRepository } from "@/data/protocols/user";
import { CreateUserAdapter } from "@/data/useCases/user";
import { CreateUserPayload, CreateUserResponse } from "@/domain/models/user";

const CREATE_USER_RESPONSE: CreateUserResponse = {
  id: "valid_id"
};

const PAYLOAD: CreateUserPayload = {
  name: "valid_name",
  email: "valid_email@example.com",
  password: "ValidPassword123!"
};

const makeCreateUserRepositoryStub = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    handle(data: CreateUserPayload): Promise<string> {
      return new Promise(resolve => resolve("valid_id"));
    }
  }

  return new CreateUserRepositoryStub();
};

interface SutTypes {
  sut: CreateUserAdapter;
  createUserRepositoryStub: CreateUserRepository;
}

const makeSut = (): SutTypes => {
  const createUserRepositoryStub = makeCreateUserRepositoryStub();
  const sut = new CreateUserAdapter(createUserRepositoryStub);

  return {
    sut,
    createUserRepositoryStub
  };
};

describe("CreateUserAdapter", () => {
  it("Should call CreateUserRepository with correct values", async () => {
    const { sut, createUserRepositoryStub } = makeSut();

    const createUserSpy = jest.spyOn(createUserRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(createUserSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it("Should throw if CreateUserRepository throws", async () => {
    const { sut, createUserRepositoryStub } = makeSut();

    jest.spyOn(createUserRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  });

  it("Should return a valid id on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(PAYLOAD);

    expect(response).toEqual(CREATE_USER_RESPONSE);
  });
});
