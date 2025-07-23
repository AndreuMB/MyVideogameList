<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getUser, setUsername } from './utils/utils'
import HoneyButton from './components/HoneyButton.vue'

const isLoggedIn = ref(false)
const auth = getAuth()
const router = useRouter()
const username = ref('')
// onMounted(() => {
onAuthStateChanged(auth, async (user) => {
  if (user) {
    isLoggedIn.value = true

    let userdb = await getUser(user.uid)

    if ((!userdb || !userdb.username) && user.email) {
      setUsername(user.uid, user.email.split('@')[0])
    }

    userdb = await getUser(user.uid)
    username.value = userdb.username
  } else {
    isLoggedIn.value = false
  }
})
// })
const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/games')
  })
}
</script>

<template>
  <img src="@/assets/honeycomb.png" alt="honeycomb" class="absolute top-0 right-0 -z-10 opacity-30" height="450" width="450">
  <header class="flex justify-between mb-10 bg-secondary rounded-2xl px-2 p-2">
    <RouterLink class="flex gap-4 items-center" to="/home">
      <img alt="web logo" src="@/assets/pixel-heart.webp" width="27" height="27" />
      <p class="text-primary text-xl font-pixel">MyVideogameList</p>
    </RouterLink>

    <div class="wrapper uppercase">
      <nav class="flex gap-2 menu items-center">
        <!-- *:rounded-xl *:hover:bg-terciary-mute *:border-2 *:border-terciary-mute *:hover:border-secondary -->
        <!-- <RouterLink  to="/" v-if="isLoggedIn">My Library</RouterLink> -->
        <!-- <RouterLink  to="/games">Games</RouterLink> -->
        <!-- <RouterLink  to="/auth" v-if="!isLoggedIn">Sign In</RouterLink> -->
        <!-- <RouterLink  :to="`/profile/${username}`" v-if="isLoggedIn">{{ username }}</RouterLink> -->
        <!-- <SearchBar class="hover:bg-secondary!" /> -->
        <!-- <a @click="handleSignOut" v-if="isLoggedIn" class="bg-terciary-mute hover:bg-terciary! uppercase cursor-pointer">Sign Out</a> -->
        <RouterLink v-if="isLoggedIn" to="/">
          <HoneyButton label="My Library" />
        </RouterLink>
        <RouterLink  to="/games">
          <HoneyButton label="Games" />
        </RouterLink>
        <RouterLink v-if="isLoggedIn" :to="`/profile/${username}`">
          <HoneyButton :label="username" />
        </RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/auth">
          <HoneyButton label="Sign In" />
        </RouterLink>
        <SearchBar class="hover:bg-secondary!" />
        <button v-if="isLoggedIn" @click="handleSignOut">
          <HoneyButton label="Sign Out" dark />
        </button>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>

</style>
