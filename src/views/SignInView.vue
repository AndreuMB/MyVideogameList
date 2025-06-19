<script setup lang="ts">
import {
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const register = () => {
  console.log('register')
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data: unknown) => {
      console.log('scucces', data)
      router.push('/')
    })
    .catch((error: unknown) => {
      console.log('fail', error)
    })
}

const singGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result.user)
      // router push
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<template>
  <h1>Sign In</h1>
  <input placeholder="email" type="email" v-model="email" />
  <input placeholder="password" type="password" v-model="password" />
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <button @click="register">Submit</button>
  <button @click="singGoogle">Sing Google</button>
  <RouterLink to="/register" class="bg-amber-50" @click="singGoogle"
    >No account? Register</RouterLink
  >
</template>
