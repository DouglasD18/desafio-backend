import { CreateUserPayload, CreateUserResponse, Validated } from "@/domain/models/user";
import { CreateUser, Validator } from "@/domain/useCases/user";
import { CreateUserController } from "@/presentation/controllers/user/create-user";
import { BadRequestError, InternalServerError } from "@/presentation/errors";
import { HttpRequest } from "@/presentation/protocols";

const VALIDATED: Validated = {
  isValid: true
}

const BODY: CreateUserPayload = {
  name: "any_name",
  email: "any_email",
  password: "any_Senha0"
}

const REQUEST: HttpRequest = {
  body: BODY
}

const CREATE_USER_RESPONSE: CreateUserResponse = {
  id: "any_id"
}

interface SutTypes {
  sut: CreateUserController
  createUserStub: CreateUser
  validatorStub: Validator
}

const makeCreateUserStub = (): CreateUser => {
  class CreateUserStub implements CreateUser {
    handle(payload: CreateUserPayload): Promise<CreateUserResponse> {
      return new Promise(resolve => resolve(CREATE_USER_RESPONSE));
    }
  }

  return new CreateUserStub();
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    handle(body: any): Validated {
      return VALIDATED;
    }
  }

  return new ValidatorStub();
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub();
  const createUserStub = makeCreateUserStub();
  const sut = new CreateUserController(createUserStub, validatorStub);

  return {
    sut,
    createUserStub,
    validatorStub
  }
}

describe('CreateUserController', () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();

    const ValidateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(REQUEST);

    expect(ValidateSpy).toHaveBeenCalledWith(REQUEST.body);
  });

  it('Should return 400 if validated.isValid is false', async () => {
    const { sut, validatorStub } = makeSut();

    const validated: Validated = {
      isValid: false,
      message: "Nome do usuário precisa ser enviado!"
    }

    jest.spyOn(validatorStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new BadRequestError("Nome do usuário precisa ser enviado!"));
  });

  it("Should call CreateUser with correct values", async () => {
    const { sut, createUserStub } = makeSut();

    const CreateUserSpy = jest.spyOn(createUserStub, "handle");
    await sut.handle(REQUEST);

    expect(CreateUserSpy).toHaveBeenCalledWith(BODY);
  });

  it('Should return 500 if CreateUser throws', async () => {
    const { sut, createUserStub } = makeSut();

    jest.spyOn(createUserStub, "handle").mockImplementation(() => {
      throw new Error("Erro interno");
    })
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.body).toEqual(new InternalServerError("Erro interno"));
    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 201 if valid values is provided.', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual(CREATE_USER_RESPONSE.id);
  });
});