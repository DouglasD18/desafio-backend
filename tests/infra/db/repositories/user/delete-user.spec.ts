import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { DeleteUserMongooseRepository } from "@/infra/db/mongoose/repositories/user";
import { UserModel } from "@/infra/db/mongoose/schemas";
import { env } from "@/main/config/env";

let userId: string;

describe("DeleteUserMongooseRepository", () => {
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

  it("should Delete the user", async () => {
    const repository = new DeleteUserMongooseRepository();

    const user = await UserModel.findById(userId);
    const result = await repository.handle(userId);
    const deletedUser = await UserModel.findById(userId);

    expect(user).not.toBeNull();
    expect(result).toBe(true);
    expect(deletedUser).toBeNull();
  });

  it("should return false if user does not exists", async () => {
    const repository = new DeleteUserMongooseRepository();

    const result = await repository.handle("65b172bd7c863c5b7732c559");

    expect(result).toBe(false);
  });
});
