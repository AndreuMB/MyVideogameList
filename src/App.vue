<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
</script>

<template>
  <header class="flex justify-between mb-10 bg-green-200 rounded-2xl p-4">
    <div class="flex gap-4">
      <img alt="Vue logo" src="@/assets/logo.svg" width="24" height="24" />
      <p class="text-black text-xl flex items-center">MyVideogameList</p>
    </div>

    <div class="wrapper uppercase">
      <nav class="flex gap-2">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/games">Games</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <SearchBar />
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
nav > a {
  display: flex;
  align-items: center;
}
</style>
