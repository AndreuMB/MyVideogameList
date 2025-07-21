<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getUser, setUsername } from './utils/utils'

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
  <header class="flex justify-between mb-10 bg-secondary rounded-2xl p-4">
    <RouterLink class="flex gap-4 items-center" to="/home">
      <img alt="web logo" src="@/assets/pixel-heart.webp" width="27" height="27" />
      <p class="text-black text-xl font-pixel">MyVideogameList</p>
    </RouterLink>

    <div class="wrapper uppercase">
      <nav class="flex gap-2 menu items-center">
        <RouterLink class="hover:bg-terciary-soft p-2 px-4 rounded-xl" to="/" v-if="isLoggedIn">My Library</RouterLink>
        <RouterLink class="hover:bg-terciary-soft p-2 px-4 rounded-xl" to="/games">Games</RouterLink>
        <RouterLink class="hover:bg-terciary-soft p-2 px-4 rounded-xl" to="/auth" v-if="!isLoggedIn">Sign In</RouterLink>
        <RouterLink class="hover:bg-terciary-soft p-2 px-4 rounded-xl" :to="`/profile/${username}`" v-if="isLoggedIn">{{ username }}</RouterLink>
        <a @click="handleSignOut" v-if="isLoggedIn" class="hover:bg-terciary p-2 px-4 rounded-xl uppercase cursor-pointer">Sign Out</a>
        <SearchBar />
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>

</style>
