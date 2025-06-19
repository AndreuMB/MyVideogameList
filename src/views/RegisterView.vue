<script setup lang="ts">
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const register = () => {
  console.log('register')
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => {
      router.push('/')
    })
    .catch((error: unknown) => {
      console.log('fail', error)
    })
}

const singGoogle = () => {
  console.log('singGoogle')
}
</script>

<template>
  <h1>Register</h1>
  <input placeholder="email" type="email" v-model="email" />
  <input placeholder="password" type="password" v-model="password" />
  <button @click="register">Submit</button>
  <button @click="singGoogle">Sing Google</button>
</template>
