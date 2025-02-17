export interface DeleteTask {
  handle(id: string): Promise<boolean>;
}