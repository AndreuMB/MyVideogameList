<script setup lang="ts">
import { ref } from 'vue'

const search_text = ref('')
</script>

<template>
  <form @submit.prevent="$router.push(`/games/${search_text}`)">
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-primary">
        <svg
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="text"
        class="block w-full p-2 ps-10 text-sm text-primary border-terciary-mute rounded-lg bg-terciary"
        required
        v-model="search_text"
      />
    </div>
  </form>
</template>
