<script setup lang="ts">
// import GameCard from '@/components/GameCard.vue'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import type { UserGameDb } from '@/interfaces/UserGameDb'
import type { Game } from '@/interfaces/GiantbombResponse'
import type { User } from '@/interfaces/User'
import {
  userIdFromUsername,
  getGamesDb,
  getGamesDbDetails,
  getUser,
  setDescription,
  setUsername,
} from '@/utils/utils'
import { onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import UserNotFound from '@/components/UserNotFound.vue'

const user: Ref<User | null> = ref(null)
const favGames: Ref<Game[] | null> = ref(null)
const isEditing = ref(false)
const isLoading = ref(true)
const isLoadingUser = ref(true)
const showModal = ref(false)
const userId = ref('')
const gamesDb: Ref<UserGameDb[] | null> = ref(null)
const route = useRoute()
const username = route.params.username.toString()


const defaultProfilePicture = '/src/assets/profile.png'

onMounted(async () => {
  isLoadingUser.value = true
  if (!username) {
    isLoadingUser.value = false
    return
  }

  const checkUserId = await userIdFromUsername(username)

  if (!checkUserId) {
    isLoadingUser.value = false
    return
  }



  const userdb = await getUser(checkUserId)
  userId.value = checkUserId
  user.value = userdb



  const gamesUser = await getGamesDb()

  if (gamesUser) {
    const favGamesDb = gamesUser.filter((game) => game.favorite)
    gamesDb.value = gamesUser
    favGames.value = await getGamesDbDetails(favGamesDb)
  }

  // const favGamesIds = await getFavoriteGamesId()
  // if (favGamesIds) favGames.value = await getGamesFromIds(favGamesIds)
  isLoading.value = false
})

const toogleEdit = () => {
  if (!user.value) return
  if (!user.value.username) return
  isEditing.value = !isEditing.value
  // save
  if (!isEditing.value) {
    setUsername(userId.value, user.value.username)
    setDescription(userId.value, user.value.description)
  }
}

const updateProfilePicture = async () => {
  showModal.value = false
  const userdb = await getUser(userId.value)
  user.value = userdb
}

const setDefaultPfP = () => {
  if (user.value) {
    user.value.picture = defaultProfilePicture
  }
}
</script>

<template>
  <div v-if="user === null && isLoadingUser==true">
    <LoadingSpinner />
  </div>
  <div v-else-if="user === null">
    <UserNotFound />
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
      <button class="rounded" @click="toogleEdit">
        <i v-if="isEditing" class="pi pi-save text-2xl! px-3 py-2"></i>
        <i v-else class="pi pi-pen-to-square text-2xl! px-3 py-2"></i>
      </button>
    </div>
    <div class="flex gap-10 mb-5 max-h-[400px]">
      <div class="relative max-w-1/3 flex justify-center">
        <img
          v-if="user.picture"
          @error="setDefaultPfP"
          :src="user.picture"
          alt="pfp"
          class="h-full rounded-full"
        />
        <img v-else :src="defaultProfilePicture" alt="defaultPfp" class="h-full rounded-full" />
        <button
          type="button"
          @click="() => (showModal = true)"
          class="absolute bottom-0 right-0 rounded"
          title="pfpModal"
        >
          <i class="pi pi-upload text-2xl! px-3 py-2"></i>
        </button>
      </div>
      <ModalComponent
        v-if="showModal"
        :user-id="userId"
        @close-modal="updateProfilePicture"
      ></ModalComponent>
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
        <GameCard
          :game="game"
          :games-db="gamesDb"
          :is-logged-in="true"
          v-for="game in favGames"
          :key="game.id"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
button {
  background-color: var(--color-terciary);
  color: var(--color-primary);
}

button:hover {
  background-color: var(--color-terciary-soft);
}
</style>
