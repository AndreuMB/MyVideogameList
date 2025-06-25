import { get, ref } from 'firebase/database'
import { getCurrentUser, useDatabase } from 'vuefire'

export const getLibraryGamesId = async (): Promise<number[]> => {
  const user = await getCurrentUser()
  if (!user) return []

  const db = useDatabase()

  const gamesRef = ref(db, `users/${user.uid}/games`)
  const gamesId = (await get(gamesRef)).val()
  return gamesId
}
