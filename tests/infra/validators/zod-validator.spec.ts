import { ZodValidator } from "@/infra/validators/zod-validator";
import { Validated } from "@/domain/models/user";

const PAYLOAD = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "SenhaForte123!"
}

describe("ZodValidator", () => {
  let validator: ZodValidator;

  beforeEach(() => {
    validator = new ZodValidator();
  });

  it("Should return isValid false if name is too short", () => {
    const invalidBody = {
      name: "Jo",
      email: PAYLOAD.email,
      password: PAYLOAD.password
    };

    const result: Validated = validator.handle(invalidBody);
    
    expect(result.isValid).toBe(false);
    expect(result.message).toContain("O nome deve ter pelo menos 3 caracteres");
  });

  it("Should return isValid false if email is invalid", () => {
    const invalidBody = {
      name: PAYLOAD.name,
      email: "invalid-email",
      password: PAYLOAD.password
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("E-mail inválido");
  });

  it("Should return isValid false if password is too short", () => {
    const invalidBody = {
      name: PAYLOAD.name,
      email: PAYLOAD.email,
      password: "123"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("A senha deve ter pelo menos 8 caracteres");
  });

  it("Should return isValid false if password does not contain uppercase letter", () => {
    const invalidBody = {
      name: PAYLOAD.name,
      email: PAYLOAD.email,
      password: "senha123!"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("A senha deve conter pelo menos uma letra maiúscula");
  });

  it("Should return isValid false if password does not contain lowercase letter", () => {
    const invalidBody = {
      name: PAYLOAD.name,
      email: PAYLOAD.email,
      password: "SENHA123!"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("A senha deve conter pelo menos uma letra minúscula");
  });

  it("Should return isValid false if password does not contain a number", () => {
    const invalidBody = {
      name: PAYLOAD.name,
      email: PAYLOAD.email,
      password: "SenhaForte!"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("A senha deve conter pelo menos um número");
  });

  it("Should return isValid false if password does not contain a special character", () => {
    const invalidBody = {
      name: PAYLOAD.name,
      email: PAYLOAD.email,
      password: "SenhaForte123"
    };

    const result: Validated = validator.handle(invalidBody);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("A senha deve conter pelo menos um caractere especial");
  });

  it("Should return isValid true if input is valid", () => {
    const validBody = PAYLOAD;

    const result: Validated = validator.handle(validBody);
    
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});
