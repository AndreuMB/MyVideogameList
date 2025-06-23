<script setup async lang="ts">
import { useDatabase, useDatabaseObject, type VueDatabaseDocumentData } from 'vuefire'
import { ref as dbRef } from 'firebase/database'
import jsonp from 'jsonp'
import type { Game, GiantbombResponse } from '@/interfaces/GiantbombResponse'
import { onMounted, ref, type Ref } from 'vue'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'

// const games: Ref<Game[]> = ref([])

const db = useDatabase()
// const auth = getAuth()

// const users = onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log(user.uid)
//     const usersRef = dbRef(db, `users/${user.uid}`)
//     return useDatabaseList(usersRef)
//   } else {
//   }
// })

// const userData = ref()
// const games: Ref<_RefDatabase<VueDatabaseQueryData<unknown>>> = ref()
// onMounted(() => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log(user.uid)
//       // const userRef = dbRef(db, `users/${user.uid}`)
//       // console.log(userData.value)
//       // userData.value = useDatabaseList(userRef)
//       games.value = useDatabaseList(dbRef(db, `users/${user.uid}`))
//       console.log('games', games)
//     } else {
//     }
//   })

// if (auth.currentUser) {
//   todos = useDatabaseList(dbRef(db, `users/${auth.currentUser!.uid}`))
//   console.log('todos', todos)
// }
// })
// const games = ref()
// games.value = useDatabaseList(dbRef(db, `users/xvTiar3wRrWf3FU3ONrq2S99FCs1`))
// await games.value.promise.value
// const games = ref(async () => {
//   const { data, promise } = useDatabaseList(dbRef(db, `users/xvTiar3wRrWf3FU3ONrq2S99FCs1`))
//   await promise.value
//   console.log(data)
//   return data
// })

// const games = useDatabaseList(dbRef(db, 'users/xvTiar3wRrWf3FU3ONrq2S99FCs1'))
// const games2 = useDatabaseObject(dbRef(db, 'users/xvTiar3wRrWf3FU3ONrq2S99FCs1'))
// console.log(games.value)
// console.log(games2.value)

interface UserProfile {
  id: string
  games?: string // o Game[] si és un array
}

const getLibraryGames = async (): Promise<Game[]> => {
  // const gamesPromise2 = useDatabaseObject(dbRef(db, 'users/xvTiar3wRrWf3FU3ONrq2S99FCs1'))
  // console.log(await gamesPromise2.promise.value)

  const profilePromise = useDatabaseObject(dbRef(db, 'users/xvTiar3wRrWf3FU3ONrq2S99FCs1')).promise
  // const profile = await profilePromise.value
  const profile: VueDatabaseDocumentData<UserProfile> | undefined = await profilePromise.value
  // if (!data) return []
  // const profile: UserProfile = data
  if (!profile || !profile.games) return []
  // console.log(profile.games)
  console.log(profile.games)
  console.log(profile.games.toString().split(','))
  const gamesArray = profile.games.toString().split(',')

  const gamesPromise: Promise<Game>[] = []
  gamesArray.forEach(async (gameId) => {
    // const game = await searchGame(gameId)
    const gamePromise = searchGame(gameId)
    gamesPromise.push(gamePromise)
    // console.log('promise games', game)
    // games.push(game)
  })

  const games: Game[] = await Promise.all(gamesPromise)

  return games
}

const games: Ref<Game[]> = ref([])

onMounted(async () => {
  games.value = await getLibraryGames()
  console.log(games.value)
})

// const searchGame = async (gameId:string) => {
//   const game = await games2.promise.value
//   console.log(game)
//   return game
// }

function searchGame(gameId: string): Promise<Game> {
  return new Promise((resolve, reject) => {
    jsonp(
      'https://www.giantbomb.com/api/games/?',
      {
        param: `api_key=${import.meta.env.VITE_GIANT_BOMB_KEY}&sort=original_release_date:desc&filter=id:${gameId}&limit=20&format=jsonp&json_callback=none`,
      },
      (err: Error | null, data: GiantbombResponse<Game[]>) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results[0])
        }
      },
    )
  })
}
// onMounted(() => {
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log('enter user')
//     games.value = useDatabaseList(dbRef(db, `users/xvTiar3wRrWf3FU3ONrq2S99FCs1`))
//     // const games2 = useDatabaseObject(dbRef(db, `users/xvTiar3wRrWf3FU3ONrq2S99FCs1`)).value
//     // console.log('todos2', games)
//     // console.log('todos2', games2)
//   }
// })
// // })
</script>

<template>
  <h1 class="text-4xl mb-10">MY LIBRARY</h1>
  <!-- <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    {{ todos }}
    <ul>
      <li v-for="(game, index) in todos" :key="index">
        <span>{{ game }}</span>
      </li>
    </ul>
    <a v-for="game in games" :key="game.id" href="#" class="group bg-green-200 rounded-2xl">
      <img
        :src="game.image.medium_url"
        alt="Tall"
        class="rounded-t-2xl h-100 w-full object-cover"
      />
      <p class="p-4 pt-1 mt-1 text-lg font-medium">{{ game.name }}</p>
    </a>
  </div> -->

  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <LoadingSpinner v-if="false" />
    <GameCard :game="game" :is-logged-in="true" v-for="game in games" :key="game.id" />
  </div>

  <!-- <ul>
    <li>test2</li>
    <li v-for="game in games2" :key="game">
      <span>{{ game }}</span>
    </li>
  </ul> -->
</template>

<style scoped></style>
