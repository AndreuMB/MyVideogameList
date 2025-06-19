<script setup lang="ts">
import type { Game } from '@/interfaces/GiantbombResponse'
import { ref, type Ref } from 'vue'
import { useDatabaseList, useDatabase } from 'vuefire'
import { ref as dbRef } from 'firebase/database'

const games: Ref<Game[]> = ref([])

const db = useDatabase()

const usersRef = dbRef(db, 'users')
const users = useDatabaseList(usersRef)
</script>

<template>
  <h1 class="text-4xl mb-10">MY LIBRARY</h1>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <ul>
      <li v-for="(user, index) in users" :key="index">
        <span>{{ user }}</span>
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
  </div>
</template>

<style scoped></style>
