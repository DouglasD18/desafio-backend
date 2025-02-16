
import { Router } from "express";
import { expressAdapter } from "../adapters/express";
import { makeCreateUserController } from "../factories/user";

export default (router: Router): void => {
  router.post("/user", expressAdapter(makeCreateUserController()));
}