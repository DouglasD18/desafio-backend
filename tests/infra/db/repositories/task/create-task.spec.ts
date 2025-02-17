import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { CreateTaskMongooseRepository } from "@/infra/db/mongoose/repositories/task";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import { TaskStatus } from "@/domain/models/task";
import { env } from "@/main/config/env";

describe("CreateTaskMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await TaskModel.deleteMany({});
  });

  afterAll(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should create a new Task", async () => {
    const repository = new CreateTaskMongooseRepository();
    
    const user = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });

    const taskId = await repository.handle({
      userId: user._id.toString(), 
      title: "valid_title",
      description: "A description",
      status: TaskStatus.PENDING
    });

    expect(taskId).toBeDefined();
  });
});
