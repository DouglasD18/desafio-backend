import { CreateTaskZodValidator } from "@/infra/validators/task";
import { Validated } from "@/domain/models/validated";
import { TaskStatus } from "@/domain/models/task";

const PAYLOAD = {
  userId: "64f8eaa4b5b6c0b15a8e4e91", 
  title: "Valid Title",
  description: "Valid description",
  status: TaskStatus.PENDING
};

describe("CreateTaskZodValidator", () => {
  let validator: CreateTaskZodValidator;

  beforeEach(() => {
    validator = new CreateTaskZodValidator();
  });

  it("Should return isValid false if userId is invalid", () => {
    const invalidBody = {
      ...PAYLOAD,
      userId: "invalid_id"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("Id inválido");
  });

  it("Should return isValid false if title is too short", () => {
    const invalidBody = {
      ...PAYLOAD,
      title: "ab"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("O título deve ter pelo menos 3 caracteres");
  });

  it("Should return isValid false if title is too long", () => {
    const invalidBody = {
      ...PAYLOAD,
      title: "a".repeat(121) 
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("O título pode ter no máximo 120 caracteres");
  });

  it("Should return isValid false if description is too short", () => {
    const invalidBody = {
      ...PAYLOAD,
      description: "ab"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("A descrição deve ter pelo menos 3 caracteres");
  });

  it("Should return isValid false if description is too long", () => {
    const invalidBody = {
      ...PAYLOAD,
      description: "a".repeat(501)
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("A descrição pode ter no máximo 500 caracteres");
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
