import { UpdateUserPayload } from "@/domain/models/user";
import { Validated } from "@/domain/models/validated";
import { UpdateUser } from "@/domain/useCases/user";
import { Validator } from "@/domain/useCases/validator";
import { UpdateUserController } from "@/presentation/controllers/user/update-user";
import { BadRequestError, InternalServerError, NotFoundError } from "@/presentation/errors";
import { HttpRequest } from "@/presentation/protocols";

const VALIDATED: Validated = {
  isValid: true
}

const BODY = {
  name: "updated_name",
  email: "updated_email@example.com"
}

const REQUEST: HttpRequest = {
  params: { id: "any_id" },
  body: BODY
}

interface SutTypes {
  sut: UpdateUserController
  updateUserStub: UpdateUser
  validatorStub: Validator
}

const makeUpdateUserStub = (): UpdateUser => {
  class UpdateUserStub implements UpdateUser {
    handle(payload: UpdateUserPayload): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }

  return new UpdateUserStub();
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
  const updateUserStub = makeUpdateUserStub();
  const sut = new UpdateUserController(updateUserStub, validatorStub);

  return {
    sut,
    updateUserStub,
    validatorStub
  }
}

describe('UpdateUserController', () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();

    const ValidateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(REQUEST);

    expect(ValidateSpy).toHaveBeenCalledWith({ ...REQUEST.body, ...REQUEST.params});
  });

  it('Should return 400 if validated.isValid is false', async () => {
    const { sut, validatorStub } = makeSut();

    const validated: Validated = {
      isValid: false,
      message: "O id precisa ser enviado!"
    }

    jest.spyOn(validatorStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new BadRequestError("O id precisa ser enviado!"));
  });

  it("Should call UpdateUser with correct values", async () => {
    const { sut, updateUserStub } = makeSut();

    const UpdateUserSpy = jest.spyOn(updateUserStub, "handle");
    await sut.handle(REQUEST);

    expect(UpdateUserSpy).toHaveBeenCalledWith({ ...BODY, id: "any_id" });
  });

  it('Should return 404 if UpdateUser return no user', async () => {
    const { sut, updateUserStub } = makeSut();

    jest.spyOn(updateUserStub, "handle").mockResolvedValueOnce(false);
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.body).toEqual(new NotFoundError("Usuário não encontrado"));
    expect(httpResponse.statusCode).toBe(404);
  });

  it('Should return 500 if UpdateUser throws', async () => {
    const { sut, updateUserStub } = makeSut();

    jest.spyOn(updateUserStub, "handle").mockImplementation(() => {
      throw new Error("Erro interno");
    })
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.body).toEqual(new InternalServerError("Erro interno"));
    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 204 if update is successful', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse.body).toBeFalsy();
  });
});
