import { Validated } from "@/domain/models/user";
import { DeleteUser, Validator } from "@/domain/useCases/user";
import { DeleteUserController } from "@/presentation/controllers/user/delete-user";
import { BadRequestError, InternalServerError, NotFoundError } from "@/presentation/errors";
import { HttpRequest } from "@/presentation/protocols";

const VALIDATED: Validated = {
  isValid: true
}

const id = "any_id";

const REQUEST: HttpRequest = {
  params: { id }
}

interface SutTypes {
  sut: DeleteUserController
  deleteUserStub: DeleteUser
  validatorStub: Validator
}

const makeDeleteUserStub = (): DeleteUser => {
  class DeleteUserStub implements DeleteUser {
    handle(id: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }

  return new DeleteUserStub();
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
  const deleteUserStub = makeDeleteUserStub();
  const sut = new DeleteUserController(deleteUserStub, validatorStub);

  return {
    sut,
    deleteUserStub,
    validatorStub
  }
}

describe('DeleteUserController', () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();

    const ValidateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(REQUEST);

    expect(ValidateSpy).toHaveBeenCalledWith({ id });
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

  it("Should call DeleteUser with correct values", async () => {
    const { sut, deleteUserStub } = makeSut();

    const DeleteUserSpy = jest.spyOn(deleteUserStub, "handle");
    await sut.handle(REQUEST);

    expect(DeleteUserSpy).toHaveBeenCalledWith(id);
  });

  it('Should return 404 if DeleteUser return false', async () => {
    const { sut, deleteUserStub } = makeSut();

    jest.spyOn(deleteUserStub, "handle").mockResolvedValueOnce(false);
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.body).toEqual(new NotFoundError("Usuário não encontrado"));
    expect(httpResponse.statusCode).toBe(404);
  });

  it('Should return 500 if DeleteUser throws', async () => {
    const { sut, deleteUserStub } = makeSut();

    jest.spyOn(deleteUserStub, "handle").mockImplementation(() => {
      throw new Error("Erro interno");
    })
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.body).toEqual(new InternalServerError("Erro interno"));
    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 204 if Delete is successful', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse.body).toBeFalsy();
  });
});
