import { Router, Express } from "express";

import userRouter from "../routes/user";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  userRouter(router);
}