<script setup lang="ts">
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Game } from '@/interfaces/GiantbombResponse'
import type { User } from '@/interfaces/User'
import {
  getFavoriteGamesId,
  getGamesFromIds,
  getUser,
  setDescription,
  setUsername,
} from '@/utils/utils'
import { onMounted, ref, type Ref } from 'vue'
import { getCurrentUser } from 'vuefire'

const user: Ref<User | null> = ref(null)
const favGames: Ref<Game[] | null> = ref(null)
const isEditing = ref(false)
const isLoading = ref(true)
let userId = ''

onMounted(async () => {
  isLoading.value = true
  const authUser = await getCurrentUser()
  const userdb = await getUser(authUser!.uid)
  if (authUser) {
    userId = authUser.uid
    user.value = userdb.val()
  }

  const favGamesIds = await getFavoriteGamesId()
  if (favGamesIds) favGames.value = await getGamesFromIds(favGamesIds)
  isLoading.value = false
})

const toogleEdit = () => {
  if (!user.value) return
  if (!user.value.username) return
  isEditing.value = !isEditing.value
  // save
  if (!isEditing.value) {
    setUsername(userId, user.value.username)
    setDescription(userId, user.value.description)
  }
}
</script>

<template>
  <div v-if="user === null">
    <LoadingSpinner />
  </div>
  <div v-else>
    <div class="w-full flex justify-between items-center mb-5">
      <input
        v-if="isEditing"
        type="text"
        class="text-6xl uppercase text-secondary bg-terciary-mute rounded"
        v-model="user.username"
        required
      />
      <h1 v-else class="text-6xl uppercase text-terciary">{{ user.username }}</h1>
      <button class="rounded bg-terciary-mute!" @click="toogleEdit">
        <i v-if="isEditing" class="pi pi-save text-2xl! px-3 py-2"></i>
        <i v-else class="pi pi-pen-to-square text-2xl! px-3 py-2"></i>
      </button>
    </div>
    <div class="flex gap-10 mb-5">
      <img src="/src//assets/emptyChest.png" alt="pfp" />
      <textarea
        v-if="isEditing"
        class="text-secondary bg-terciary-mute rounded w-full p-5"
        v-model="user.description"
      >
      </textarea>
      <div v-else>
        <div v-if="user.description">
          {{ user.description }}
        </div>
        <div v-else>
          <h2 class="text-4xl">NO DESCRIPTION</h2>
          <p class="text-2xl text-terciary">SO BORING 😴</p>
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-3xl uppercase mb-5 text-terciary">FAVORITE GAMES</h1>
      <div v-if="isLoading">
        <LoadingSpinner />
      </div>
      <div v-else-if="!favGames && !isLoading">
        <h2 class="text-4xl">NO FAVORITES</h2>
        <p class="text-2xl text-terciary">SO PIKY 🙄</p>
      </div>
      <div
        v-else
        class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8"
      >
        <GameCard :game="game" :is-logged-in="true" v-for="game in favGames" :key="game.id" />
      </div>
    </div>
  </div>
</template>
