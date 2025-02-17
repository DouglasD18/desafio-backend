import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { ListUserByIdMongooseRepository } from "@/infra/db/mongoose/repositories/user";
import { UserModel } from "@/infra/db/mongoose/schemas";
import { env } from "@/main/config/env";

let id: string;

describe("ListUserByIdMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should return null if user does not exist", async () => {
    const repository = new ListUserByIdMongooseRepository();
    
    const user = await repository.handle("660f4c33b5d2c43134c2a3e9"); 
    
    expect(user).toBeNull();
  });

  it("should return a user if it exists", async () => {
    const repository = new ListUserByIdMongooseRepository();
    
    const createdUser = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });

    id = createdUser._id.toString(); 

    const user = await repository.handle(id);

    expect(user).not.toBeNull();
    expect(user).toHaveProperty("id", id);
    expect(user).toHaveProperty("name", "John Doe");
    expect(user).toHaveProperty("email", "john@example.com");
  });
});
