export interface DeleteUser {
  handle(id: string): Promise<boolean>;
}