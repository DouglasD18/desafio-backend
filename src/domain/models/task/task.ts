export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
}

export enum TaskStatus {
  PENDING = "pendente",
  IN_PROGRESS = "em progresso",
  COMPLETED = "concluída",
}
