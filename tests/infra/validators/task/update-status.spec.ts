import { UpdateStatusZodValidator } from "@/infra/validators/task";
import { Validated } from "@/domain/models/validated";
import { TaskStatus } from "@/domain/models/task";

const PAYLOAD = {
  id: "64f8eaa4b5b6c0b15a8e4e91", 
  status: TaskStatus.PENDING
};

describe("UpdateStatusZodValidator", () => {
  let validator: UpdateStatusZodValidator;

  beforeEach(() => {
    validator = new UpdateStatusZodValidator();
  });

  it("Should return isValid false if id is invalid", () => {
    const invalidBody = {
      ...PAYLOAD,
      id: "invalid_id"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("Id inválido");
  });

  it("Should return isValid false if status is invalid", () => {
    const invalidBody = {
      ...PAYLOAD,
      status: "invalid_status"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("Status inválido");
  });

  it("Should return isValid true if input is valid", () => {
    const validBody = PAYLOAD;

    const result: Validated = validator.handle(validBody);

    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});
