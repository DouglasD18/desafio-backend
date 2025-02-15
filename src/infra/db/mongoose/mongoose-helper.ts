import mongoose from "mongoose";

export const MongooseHelper = {
  async connect(uri: string): Promise<void> {
    await mongoose.connect(uri);
  },

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
};
