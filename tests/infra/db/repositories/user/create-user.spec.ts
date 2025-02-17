import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { CreateUserMongooseRepository } from "@/infra/db/mongoose/repositories/user";
import { UserModel } from "@/infra/db/mongoose/schemas";
import { env } from "@/main/config/env";

describe("CreateUserMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should create a new user", async () => {
    const repository = new CreateUserMongooseRepository();

    const userId = await repository.handle({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });

    expect(userId).toBeDefined();
  });
});
