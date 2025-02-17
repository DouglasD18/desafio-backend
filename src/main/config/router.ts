import { Router, Express } from "express";

import userRouter from "../routes/user";
import taskRouter from "../routes/task";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  userRouter(router);
  taskRouter(router);
}
