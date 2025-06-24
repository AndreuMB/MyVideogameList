<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const isLoggedIn = ref(false)
const auth = getAuth()
const router = useRouter()
// onMounted(() => {
onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }
})
// })
const handleSignOut = () => {
  signOut(auth).then(() => {
    console.log('singed out')
    router.push('/games')
  })
}
</script>

<template>
  <header class="flex justify-between mb-10 bg-green-200 rounded-2xl p-4">
    <div class="flex gap-4 items-center">
      <img alt="web logo" src="@/assets/pixel-heart.webp" width="27" height="27" />
      <!-- <i class="pi pi-heart-fill text-2xl webIcon"></i> -->
      <p class="text-black text-xl">MyVideogameList</p>
    </div>

    <div class="wrapper uppercase">
      <nav class="flex gap-2 menu">
        <RouterLink to="/" v-if="isLoggedIn">My Library</RouterLink>
        <RouterLink to="/games">Games</RouterLink>
        <RouterLink to="/auth" v-if="!isLoggedIn">Sign In</RouterLink>
        <a @click="handleSignOut" v-if="isLoggedIn" class="uppercase">Sign Out</a>
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
  border-radius: 10px;
  padding: 5px;
}
</style>
