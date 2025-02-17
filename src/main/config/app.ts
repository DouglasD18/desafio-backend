import express from 'express';

import setupSwagger from "./swagger";
import setupMiddlewares from "./middlewares";
import setupRouter from "./router";

const app = express();
setupSwagger(app);
setupMiddlewares(app);
setupRouter(app);

export default app;
