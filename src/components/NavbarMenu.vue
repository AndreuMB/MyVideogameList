<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, useTemplateRef } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getUser, setUsername } from '../utils/utils'
import MenuLinks from './MenuLinks.vue'
import HamburgerButton from './HamburgerButton.vue'

const isLoggedIn = ref(false)
const auth = getAuth()
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

const menu = useTemplateRef('menu')
const isMenuOpen = ref(false)

const toggleMenu = () => {
  if (!menu.value) return
  isMenuOpen.value = !isMenuOpen.value
}
</script>
<template>
  <header
    class="flex flex-wrap md:justify-between gap-4 items-center mb-10 bg-secondary rounded-2xl px-2 py-2"
  >
    <HamburgerButton @click="toggleMenu" class="md:hidden bg-transparent! text-primary" />

    <!-- Logo -->
    <RouterLink class="flex gap-2 items-center" to="/home">
      <img alt="web logo" src="@/assets/pixel-heart.webp" width="27" height="27" />
      <p class="text-primary text-xl font-pixel">MyVideogameList</p>
    </RouterLink>
    <!-- Menu -->
    <div
      ref="menu"
      :class="isMenuOpen === true ? '' : ''"
      class="uppercase flex gap-2 items-center not-md:hidden"
    >
      <MenuLinks :username="username" :isLoggedIn="isLoggedIn"></MenuLinks>
    </div>
  </header>
  <div
    v-if="isMenuOpen"
    @click="toggleMenu"
    class="absolute top-0 left-0 w-full h-full z-10 bg-primary opacity-50"
  ></div>
  <nav
    class="absolute top-0 left-0 bg-secondary w-auto h-full p-4 rounded-tr-2xl z-10 transition-transform duration-300 ease-in-out"
    :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="w-full text-right">
      <HamburgerButton @click="toggleMenu" class="bg-transparent! text-primary" />
    </div>
    <div class="mr-10 z-10 flex flex-col gap-2 items-start">
      <MenuLinks :username="username" :isLoggedIn="isLoggedIn"></MenuLinks>
    </div>
  </nav>
</template>
