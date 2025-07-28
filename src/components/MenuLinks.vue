<script setup lang="ts">
import HoneyButton from './HoneyButton.vue'
import SearchBar from './SearchBar.vue'
import { RouterLink, useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

defineProps<{
  isLoggedIn: boolean
  username: string
}>()

const auth = getAuth()
const router = useRouter()

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/games')
  })
}
</script>
<template>
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
</template>
