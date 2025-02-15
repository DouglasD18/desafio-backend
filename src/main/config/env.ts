import dotenv from "dotenv";

dotenv.config();

export const env = {
  mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/my-db",
  port: Number(process.env.PORT) || 3000
};
