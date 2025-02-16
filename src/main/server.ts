import { MongooseHelper } from "../infra/db/mongoose/mongoose-helper";
import app from "./config/app";
import { env } from "./config/env";

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(env.port, async () => {
  try {
    await MongooseHelper.connect(env.mongoUrl);
    
    console.log("Server is Running!");
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
});

process.on("SIGINT", async () => {
  await MongooseHelper.disconnect(); 
  console.log("Servidor finalizado.");
  process.exit(0); 
});

process.on("SIGTERM", async () => {
  await MongooseHelper.disconnect(); 
  console.log("Servidor finalizado.");
  process.exit(0); 
});
