export interface DeleteUserRepository {
  handle(id: string): Promise<boolean>
}