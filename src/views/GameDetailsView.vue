<script setup async lang="ts">
import { nextTick, onMounted, ref, useTemplateRef, type Ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useRoute } from 'vue-router'
import type { Game } from '@/interfaces/GiantbombResponse'
import { getGameById, getGameDb, getUserGameDb } from '@/utils/utils'
import GameRaiting from '@/components/GameRating.vue'
import type { GameDb } from '@/interfaces/GameDb'
import FavToggle from '@/components/FavToggle.vue'
import type { UserGameDb } from '@/interfaces/UserGameDb'
import DropdownGameState from '@/components/DropdownGameState.vue'
import BookmarkToggle from '@/components/BookmarkToggle.vue'
import { getCurrentUser } from 'vuefire'

const isLoading = ref(true)
const isLoggedIn = ref(false)
const route = useRoute()
const game: Ref<Game | null> = ref(null)
const userGameDb: Ref<UserGameDb | null> = ref(null)
const gameDb: Ref<GameDb | null> = ref(null)
const descriptionHidden = ref(true)
const description = useTemplateRef('description')
const descriptionComplete = document.createElement('div')
const gameId = Number.parseInt(route.params.gameId.toString())

onMounted(async () => {
  isLoading.value = true
  const user = await getCurrentUser()
  if (user) isLoggedIn.value = true
  game.value = await getGameById(gameId, '')
  gameDb.value = await getGameDb(gameId)
  userGameDb.value = await getUserGameDb(gameId)
  isLoading.value = false

  await nextTick()

  if (!game.value) return

  let gameDescription = game.value.description
  if (!gameDescription) return
  gameDescription = gameDescription.replace('<h2>Overview</h2>', '')
  // gameDescription = gameDescription.slice(25, -1); not work cut when still html string
  // game.value.description = gameDescription

  if (description.value) {
    descriptionComplete.innerHTML = ''
    descriptionComplete.innerHTML = gameDescription

    descriptionComplete.querySelectorAll('figure').forEach((figure) => {
      figure.remove()
    })

    if (descriptionComplete.firstChild)
      description.value.append(descriptionComplete.firstChild.cloneNode(true))
  }
})

const toogleHidden = () => {
  descriptionHidden.value = !descriptionHidden.value

  if (description.value) {
    description.value.innerHTML = ''
    if (descriptionHidden.value) {
      if (descriptionComplete.firstChild)
        description.value.append(descriptionComplete.firstChild.cloneNode(true))
    } else {
      description.value.append(descriptionComplete.cloneNode(true))
    }
  }
}

// const favValidation = ():boolean => {
//   if (userGameDb.value) {
//     if (!userGameDb.value.isInLibrary) return false
//     if (userGameDb.value.state != 2) return false
//     return true
//   }
//   return false
// }

const handleStateChange = async () => {
  userGameDb.value = await getUserGameDb(gameId)
}
</script>

<template>
  <LoadingSpinner v-if="isLoading || game == null" />
  <div v-else>
    <div class="mb-10">
      <div class="flex justify-between h-full">
        <h1 class="text-4xl text-terciary font-pixel">{{ game.name }}</h1>
        <div v-if="isLoggedIn" class="flex gap-2 items-center">
          <BookmarkToggle :game-id="game.id" @state-change="handleStateChange" />
          <template v-if="userGameDb && userGameDb.isInLibrary">
            <DropdownGameState :game-id="game.id" @state-change="handleStateChange" />
            <FavToggle v-if="userGameDb.state == 2" :game-id="game.id" :game-db="userGameDb" />
          </template>
        </div>
      </div>
      <p class="text-2xl">{{ game.date_added.split(' ')[0] }}</p>
    </div>
    <div class="flex gap-10">
      <div class="max-w-1/4">
        <img class="" :src="game.image.medium_url" alt="gameImg" />
        <GameRaiting
          v-if="userGameDb && userGameDb.isInLibrary && userGameDb.state == 2"
          :game-id="game.id"
          :rating="gameDb?.rating || 0"
          :game-db="gameDb"
          @rating-change="async () => (gameDb = await getGameDb(game!.id))"
          class="mt-1"
        ></GameRaiting>
        <h2 class="text-2xl mt-5 text-terciary">PLATFORMS</h2>
        <p v-for="platform in game.platforms" :key="platform.id">
          {{ platform.name }}
        </p>
      </div>
      <div class="w-3/4">
        <h2 class="text-2xl text-terciary">DESCRIPTION</h2>
        <div v-if="game.description" :class="$style.description">
          <div ref="description" class="description"></div>
          <span @click="toogleHidden" class="text-terciary hover:text-terciary-soft cursor-pointer">
            {{ descriptionHidden ? 'Show more' : 'Show less' }}
          </span>
        </div>
        <h2 v-else class="text-2xl text-terciary">NO DESCRIPTION AVAILABLE :(</h2>
      </div>
    </div>
  </div>
</template>

<style module>
.description {
  h2 {
    font-size: 20px;
    margin-top: 5px;
  }
}

table {
  margin: 20px;
}

table,
td,
th {
  border: 1px solid #ddd;
  text-align: left;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 15px;
}
</style>
