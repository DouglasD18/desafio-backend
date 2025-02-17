import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  status: "pendente" | "em progresso" | "concluído";
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    title: { type: String, required: true },
    description: { type: String, required: true }, 
    status: { 
      type: String, 
      enum: ["pendente", "em progresso", "concluído"], 
      required: true 
    },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);
