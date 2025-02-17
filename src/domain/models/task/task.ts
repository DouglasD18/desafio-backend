export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
}

export enum TaskStatus {
  PENDING = "pendente",
  IN_PROGRESS = "em progresso",
  COMPLETED = "concluída",
}

export type TaskByUser = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}
