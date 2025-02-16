import app from "./config/app";
import { env } from "./config/env";

app.listen(env.port, async () => {
  console.log("Server is Running!");
});
