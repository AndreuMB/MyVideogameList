<script setup lang="ts">
defineProps({
  game: { type: Object, required: true },
})
</script>

<template>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <a href="#" class="group bg-green-200 rounded-2xl">
      <img :src="game.cover" alt="game cover" class="rounded-t-2xl" />
      <p class="p-4 pt-1 mt-1 text-lg font-medium">{{ game.name }}Undertale</p>
    </a>
  </div>
</template>

<style scoped></style>
