import { DeleteUserZodValidator } from "@/infra/validators/user";
import { Validated } from "@/domain/models/validated";

const PAYLOAD = {
  id: "65b172bd7c863c5b7732c559"
}

describe("DeleteUserZodValidator", () => {
  let validator: DeleteUserZodValidator;

  beforeEach(() => {
    validator = new DeleteUserZodValidator();
  });

  it("Should return isValid false if id is not provided", () => {
    const invalidBody = {};

    const result: Validated = validator.handle(invalidBody);
    
    expect(result.isValid).toBe(false);
    expect(result.message).toContain("Required");
  });

  it("Should return isValid false if id is invalid", () => {
    const invalidBody = {
      id: "invalid-id"
    };

    const result: Validated = validator.handle(invalidBody);
    
    expect(result.isValid).toBe(false);
    expect(result.message).toContain("Id inválido");
  });

  it("Should return isValid true if input is valid", () => {
    const validBody = PAYLOAD;

    const result: Validated = validator.handle(validBody);
    
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});
