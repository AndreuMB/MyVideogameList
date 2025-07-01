<script setup lang="ts">
  import GameCard from '@/components/GameCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import type { Game } from '@/interfaces/GiantbombResponse';
  import type { User } from '@/interfaces/User';
  import { getFavoriteGamesId, getGamesFromIds, getUser } from '@/utils/utils';
  import { onMounted, ref, type Ref } from 'vue';
  import { getCurrentUser } from 'vuefire';

  const user:Ref<User|null> = ref(null)
  const favGames:Ref<Game[]|null> = ref(null)

  onMounted(async ()=> {
    const authUser = await getCurrentUser()
    const userdb = await getUser(authUser!.uid)
    user.value = userdb.val()
    const favGamesIds = await getFavoriteGamesId()
    if (favGamesIds) favGames.value = await getGamesFromIds(favGamesIds)
  })
</script>

<template>
  <div v-if="user===null">
    <LoadingSpinner />
  </div>
  <div v-else>
    <h1 class="text-6xl uppercase mb-5 text-terciary">{{ user.username }}</h1>
    <div class="flex gap-10 mb-5">
      <img src="/src//assets/emptyChest.png" alt="pfp">
      <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore perferendis error natus quod officiis debitis distinctio alias cum, impedit voluptates repellendus, quos quisquam animi praesentium aut, cupiditate eveniet. Adipisci, ipsa.</div>
    </div>
    <div>
      <h1 class="text-3xl uppercase mb-5 text-terciary">FAVORITE GAMES</h1>
      <div v-if="!favGames">
        <p>NO FAV GAMES <br> SO PIKY</p>
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
