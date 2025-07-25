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

const isMenuOpen = ref(false)
</script>

<template>
  <!-- Background Image Honeycomb -->
  <img src="@/assets/honeycomb.png" alt="honeycomb" class="absolute top-0 right-0 -z-10 opacity-30" height="450" width="450">

  <header class="flex flex-wrap md:justify-between items-center mb-10 bg-secondary rounded-2xl px-2 py-2">
    <!-- Hamburger -->
    <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Logo -->
    <RouterLink class="flex gap-4 items-center" to="/home">
      <img alt="web logo" src="@/assets/pixel-heart.webp" width="27" height="27" />
      <p class="text-primary text-xl font-pixel">MyVideogameList</p>
    </RouterLink>



    <!-- Menu -->
    <div
      :class="[
        'w-full md:w-auto mt-4 md:mt-0 md:flex md:items-center gap-2',
        isMenuOpen ? 'block' : 'hidden',
        'md:block'
      ]"
      class="uppercase"
    >
      <nav class="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <RouterLink v-if="isLoggedIn" to="/">
          <HoneyButton label="My Library" />
        </RouterLink>
        <RouterLink to="/games">
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
