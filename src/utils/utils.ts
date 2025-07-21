import type { UserGameDb } from '@/interfaces/UserGameDb'
import type { Game, GiantbombResponse } from '@/interfaces/GiantbombResponse'
import {
  get,
  query,
  ref,
  set,
  orderByKey,
  limitToFirst,
  startAfter,
  update,
  push,
} from 'firebase/database'
import jsonp from 'jsonp'
import { getCurrentUser, useDatabase } from 'vuefire'
import type { GameDb, GameDbComment } from '@/interfaces/GameDb'
import type { User } from '@/interfaces/User'

export const exampleGame: Game = {
  aliases: 'GTA V, Grand Theft Auto 5',
  api_detail_url: 'https://www.giantbomb.com/api/game/3030-4664/',
  date_added: '2013-09-17 00:00:00',
  date_last_updated: '2023-12-01 10:45:23',
  deck: 'An open-world action-adventure game set in Los Santos.',
  description: '<p>Grand Theft Auto V is an open-world crime game developed by Rockstar North.</p>',
  expected_release_day: 17,
  expected_release_month: 9,
  expected_release_quarter: 'Q3',
  expected_release_year: 2013,
  guid: '3030-4664',
  id: 4664,
  image: {
    icon_url: 'https://example.com/image/icon.jpg',
    medium_url: 'https://example.com/image/medium.jpg',
    screen_url: 'https://example.com/image/screen.jpg',
    screen_large_url: 'https://example.com/image/screen_large.jpg',
    small_url: 'https://example.com/image/small.jpg',
    super_url: 'https://example.com/image/super.jpg',
    thumb_url: 'https://example.com/image/thumb.jpg',
    tiny_url: 'https://example.com/image/tiny.jpg',
    original_url: 'https://example.com/image/original.jpg',
    image_tags: 'cover, logo',
  },
  image_tags: [
    {
      api_detail_url: 'https://www.giantbomb.com/api/image_tag/1/',
      name: 'cover',
      total: 12,
    },
    {
      api_detail_url: 'https://www.giantbomb.com/api/image_tag/2/',
      name: 'logo',
      total: 5,
    },
  ],
  name: 'Grand Theft Auto V',
  number_of_user_reviews: 10500,
  original_game_rating: 'Mature',
  original_release_date: '2013-09-17',
  platforms: [
    {
      api_detail_url: 'https://www.giantbomb.com/api/platform/1/',
      id: 1,
      name: 'PlayStation 3',
      site_detail_url: 'https://www.giantbomb.com/playstation-3/3045-35/',
      abbreviation: 'PS3',
    },
    {
      api_detail_url: 'https://www.giantbomb.com/api/platform/2/',
      id: 2,
      name: 'Xbox 360',
      site_detail_url: 'https://www.giantbomb.com/xbox-360/3045-20/',
      abbreviation: 'X360',
    },
    {
      api_detail_url: 'https://www.giantbomb.com/api/platform/3/',
      id: 3,
      name: 'PC',
      site_detail_url: 'https://www.giantbomb.com/pc/3045-94/',
      abbreviation: 'PC',
    },
  ],
  site_detail_url: 'https://www.giantbomb.com/games/3030-4664/',
}

export const getUser = async (userUid: string): Promise<User> => {
  const db = useDatabase()

  const userRef = ref(db, `users/${userUid}`)
  const user = await get(userRef)
  return user.val()
}

export const userIdFromUsername = async (username: string): Promise<string | null> => {
  const db = useDatabase()
  const userRef = ref(db, `users/`)
  const usersDS = await get(userRef)
  const users =  usersDS.val()
  const usersArray: string[] = Object.keys(users)

  let foundUserId = null
  usersArray.forEach((userId)=> {
    if (users[userId].username === username) foundUserId = userId
  })

  return foundUserId || null
}

export const setUsername = async (userUid: string, username: string): Promise<void> => {
  const db = useDatabase()
  const userRef = ref(db, `users/${userUid}/username`)
  await set(userRef, username)
}

export const setProfilePicture = async (userUid: string, pfpUrl: string): Promise<void> => {
  const db = useDatabase()
  const userRef = ref(db, `users/${userUid}/picture`)
  await set(userRef, pfpUrl)
}

export const setDescription = async (userUid: string, description: string): Promise<void> => {
  const db = useDatabase()
  const userRef = ref(db, `users/${userUid}/description`)
  await set(userRef, description)
}

export const getGamesFromIds = async (gamesId: number[]): Promise<Game[]> => {
  const gamesData: Game[] = []

  for await (const gameId of gamesId) {
    const game = await getGameById(gameId)
    if (game) gamesData.push(game)
  }

  return gamesData
}

export const getGamesDb = async (
  limit: number = 99,
  offset: number = 0,
): Promise<UserGameDb[] | null> => {
  const user = await getCurrentUser()
  if (!user) return []

  const db = useDatabase()

  const gamesRef = ref(db, `users/${user.uid}/games`)
  const q = query(gamesRef, orderByKey(), startAfter(offset.toString()), limitToFirst(limit))
  const gamesDS = await get(q)
  const gamesId: UserGameDb[] | null = gamesDS.val()

  if (gamesId) return Object.values(gamesId)

  return null
}

export const getGamesDbDetails = async (gamesDb: UserGameDb[]): Promise<Game[]> => {
  const gamesData: Game[] = []

  for await (const gameDb of gamesDb) {
    const game = await getGameById(gameDb.id)
    if (game) gamesData.push(game)
  }

  return gamesData
}

// export const getFavoriteGamesId = async (): Promise<number[] | null> => {
//   const user = await getCurrentUser()
//   if (!user) return []

//   const db = useDatabase()

//   const gamesRef = ref(db, `users/${user.uid}/favorite_games`)
//   const gamesId = (await get(gamesRef)).val()
//   return gamesId
// }

export const addGameToLibrary = async (gameId: number) => {
  const user = await getCurrentUser()
  if (!user) return
  const db = useDatabase()

  const gamesRef = ref(db, `users/${user.uid}/games/${gameId}`)

  update(gamesRef, { id: gameId, isInLibrary: true })
}

export const removeGameFromLibrary = async (gameId: number) => {
  const user = await getCurrentUser()
  if (!user) return
  const db = useDatabase()

  const gamesRef = ref(db, `users/${user.uid}/games/${gameId}/isInLibrary`)

  set(gamesRef, false)
}

export const addGameToFavorites = async (gameId: number): Promise<void> => {
  const user = await getCurrentUser()
  if (!user) return
  const db = useDatabase()

  const gameRef = ref(db, `users/${user.uid}/games/${gameId}/favorite`)

  set(gameRef, true)
}

export const countUserFavorites = async () => {
  const gamesDb = await getGamesDb()
  let count = 0
  if (gamesDb) {
    gamesDb.forEach((game) => {
      if (game.favorite === true) count++
    })
  }
  return count
}

export const removeGameFromFavorites = async (gameId: number): Promise<void> => {
  const user = await getCurrentUser()
  if (!user) return
  const db = useDatabase()

  const gameRef = ref(db, `users/${user.uid}/games/${gameId}/favorite`)

  set(gameRef, false)
}

const getGamesPromise = (
  fieldList: string,
  filter?: string,
  sort?: string,
  limit?: string,
  offset?: string,
): Promise<Game[] | undefined> => {
  const apikey = import.meta.env.VITE_GIANT_BOMB_KEY
  const jsonpParam = 'format=jsonp&json_callback=none'

  return new Promise((resolve, reject) => {
    jsonp(
      'https://www.giantbomb.com/api/games/?',
      {
        param: `api_key=${apikey}&field_list=${fieldList}&sort=${sort}&filter=${filter}&limit=${limit}&offset=${offset}&${jsonpParam}`,
      },
      (err: Error | null, data: GiantbombResponse<Game[]>) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results)
        }
      },
    )
  })
}

export const getGamesOrderByRelease = async (
  results: string,
  offset?: string,
): Promise<Game[] | undefined> => {
  const fieldList = 'id,name,image'
  const filter = `original_release_date:2000|${new Date().toISOString()}`
  const sort = 'original_release_date:desc'
  const limit = results
  const games = await getGamesPromise(fieldList, filter, sort, limit, offset)
  return games
}

export const getGameById = async (
  gameId: number,
  fieldList: string = 'id,name,image',
): Promise<Game | null> => {
  const filter = `id:${gameId}`
  const games = await getGamesPromise(fieldList, filter)
  if (games) return games[0]
  return null
}

export const searchGamesByName = async (gameName: string) => {
  const fieldList = 'id,name,image'
  const filter = `name:${gameName}`
  const sort = 'original_release_date:desc'
  const limit = '12'
  return await getGamesPromise(fieldList, filter, sort, limit)
}

export const changeGameState = async (gameId: number, gameStateId: number): Promise<void> => {
  const user = await getCurrentUser()
  if (!user) return
  const db = useDatabase()

  const gameRef = ref(db, `users/${user.uid}/games/${gameId}/state/`)

  set(gameRef, gameStateId)
}

export const getGameState = async (gameId: number): Promise<number> => {
  const user = await getCurrentUser()
  if (!user) return 0
  const db = useDatabase()

  const gameRef = ref(db, `users/${user.uid}/games/${gameId}/state/`)

  const gameState = await get(gameRef)
  return gameState.val()
}

export const changeGameRating = async (gameId: number, rating: number): Promise<void> => {
  const user = await getCurrentUser()
  if (!user) return
  const db = useDatabase()

  const gameUserRef = ref(db, `users/${user.uid}/games/${gameId}/rating/`)
  const userRating = await get(gameUserRef)
  set(gameUserRef, rating)

  const gameDb = await getGameDb(gameId)
  const gameRef = ref(db, `games/${gameId}/`)
  // have valoration
  if (gameDb && gameDb.rating && gameDb.ratingContributors) {
    // user already rate
    if (userRating.val()) {
      gameDb.rating -= userRating.val()
      gameDb.rating += rating
    } else {
      gameDb.rating += rating
      gameDb.ratingContributors += 1
    }
    set(gameRef, gameDb)
  } else {
    set(gameRef, { rating, ratingContributors: 1 })
  }
}

export const getGameDb = async (gameId: number): Promise<GameDb | null> => {
  const user = await getCurrentUser()
  if (!user) return null
  const db = useDatabase()
  const gameRef = ref(db, `games/${gameId}`)

  const gameState = await get(gameRef)
  return gameState.val()
}

export const getUserGameDb = async (gameId: number): Promise<UserGameDb | null> => {
  const user = await getCurrentUser()
  if (!user) return null
  const db = useDatabase()
  const gameRef = ref(db, `users/${user.uid}/games/${gameId}`)

  const gameState = await get(gameRef)
  return gameState.val()
}

export const insertCommet = async (gameId: number, comment:string): Promise<void> => {
  const user = await getCurrentUser()
  if (!user) return
  const date = new Date()
  const gameDbComment: GameDbComment = {
    usernameId: user.uid,
    comment,
    date: date.toLocaleDateString('es-ES')
  }
  const db = useDatabase()
  const gameRef = ref(db, `/games/${gameId}/comments`)
  push(gameRef, gameDbComment)
}
