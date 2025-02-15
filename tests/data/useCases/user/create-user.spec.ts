import { CreateUserModel } from "@/data/protocols/user";
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

const makeCreateUserModelStub = (): CreateUserModel => {
  class CreateUserModelStub implements CreateUserModel {
    handle(data: CreateUserPayload): Promise<string> {
      return new Promise(resolve => resolve("valid_id"));
    }
  }

  return new CreateUserModelStub();
};

interface SutTypes {
  sut: CreateUserAdapter;
  createUserModelStub: CreateUserModel;
}

const makeSut = (): SutTypes => {
  const createUserModelStub = makeCreateUserModelStub();
  const sut = new CreateUserAdapter(createUserModelStub);

  return {
    sut,
    createUserModelStub
  };
};

describe("CreateUserAdapter", () => {
  it("Should call CreateUserModel with correct values", async () => {
    const { sut, createUserModelStub } = makeSut();

    const createUserSpy = jest.spyOn(createUserModelStub, "handle");
    await sut.handle(PAYLOAD);

    expect(createUserSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it("Should throw if CreateUserModel throws", async () => {
    const { sut, createUserModelStub } = makeSut();

    jest.spyOn(createUserModelStub, "handle").mockImplementationOnce(() => {
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
