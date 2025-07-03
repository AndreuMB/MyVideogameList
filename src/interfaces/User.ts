import type { GameDb } from "./GameDb"

export interface User {
  username: string
  games: GameDb[]
  description: string
  picture: string
}
