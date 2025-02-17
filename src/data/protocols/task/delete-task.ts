export interface DeleteTaskRepository {
  handle(id: string): Promise<boolean>
}