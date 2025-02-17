
import { Router } from "express";
import { expressAdapter } from "../adapters/express";
import {
  makeCreateTaskController
} from "../factories/task";

export default (router: Router): void => {
  router.post("/task", expressAdapter(makeCreateTaskController()));
}
