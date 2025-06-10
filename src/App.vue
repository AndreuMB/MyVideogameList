<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex justify-between mb-5 bg-green-200 rounded-2xl p-4">
    <div class="flex gap-4">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="24" height="24" />
      <p class="text-black text-xl">MyVideogameList</p>
    </div>

    <div class="wrapper uppercase">
      <nav class="flex gap-2">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped></style>
