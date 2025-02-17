import { Validated } from "@/domain/models/validated";
import { DeleteTask } from "@/domain/useCases/task";
import { Validator } from "@/domain/useCases/validator";
import { DeleteTaskController } from "@/presentation/controllers/task/delete-task";
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
  sut: DeleteTaskController
  deleteTaskStub: DeleteTask
  validatorStub: Validator
}

const makeDeleteTaskStub = (): DeleteTask => {
  class DeleteTaskStub implements DeleteTask {
    handle(id: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }

  return new DeleteTaskStub();
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
  const deleteTaskStub = makeDeleteTaskStub();
  const sut = new DeleteTaskController(deleteTaskStub, validatorStub);

  return {
    sut,
    deleteTaskStub,
    validatorStub
  }
}

describe('DeleteTaskController', () => {
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

  it("Should call DeleteTask with correct values", async () => {
    const { sut, deleteTaskStub } = makeSut();

    const DeleteTaskSpy = jest.spyOn(deleteTaskStub, "handle");
    await sut.handle(REQUEST);

    expect(DeleteTaskSpy).toHaveBeenCalledWith(id);
  });

  it('Should return 404 if DeleteTask return false', async () => {
    const { sut, deleteTaskStub } = makeSut();

    jest.spyOn(deleteTaskStub, "handle").mockResolvedValueOnce(false);
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.body).toEqual(new NotFoundError("Tarefa não encontrada"));
    expect(httpResponse.statusCode).toBe(404);
  });

  it('Should return 500 if DeleteTask throws', async () => {
    const { sut, deleteTaskStub } = makeSut();

    jest.spyOn(deleteTaskStub, "handle").mockImplementation(() => {
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
