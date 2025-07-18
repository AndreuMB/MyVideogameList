export interface GameDb {
  rating?: number
  ratingContributors?: number
  comments?: GameDbComment[]
}

export interface GameDbComment {
  usernameId: string
  comment: string
  date: string
}
