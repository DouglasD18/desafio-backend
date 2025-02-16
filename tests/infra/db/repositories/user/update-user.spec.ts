import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { UpdateUserMongooseRepository } from "@/infra/db/mongoose/repositories/user";
import { UserModel } from "@/infra/db/mongoose/schemas";
import { env } from "@/main/config/env";

let userId: string;

describe("UpdateUserMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    
    const user = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });
    userId = user._id.toString();  
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should update the user", async () => {
    const repository = new UpdateUserMongooseRepository();

    const result = await repository.handle({
      id: userId,
      name: "John Doe",
      email: "john_doe@example.com",
      password: "securePassword123!"
    });

    const updatedUser = await UserModel.findById(userId);

    expect(result).toBe(true);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe("John Doe");
    expect(updatedUser?.email).toBe("john_doe@example.com");
    expect(updatedUser?.password).toBe("securePassword123!");
  });

  it("should return false if user does not exists", async () => {
    const repository = new UpdateUserMongooseRepository();

    const result = await repository.handle({
      id: "65b172bd7c863c5b7732c559",
      name: "John Doe",
      email: "john_doe@example.com",
      password: "XXXXXXXXXXXXXXXXX!"
    });

    expect(result).toBe(false);
  });
});
