export type UserRole = "admin" | "user"

export interface AppUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}
