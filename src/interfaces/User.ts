import type { UserGameDb } from './UserGameDb'

export interface User {
  username: string
  games: UserGameDb[]
  description: string
  picture: string
}
