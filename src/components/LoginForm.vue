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
const login = () => {
  console.log('login')
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data: unknown) => {
      console.log('scucces', data)
      router.push('/')
    })
    .catch((error: unknown) => {
      console.log('fail', error)
    })
}

const singInGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result.user)
      router.push('/')
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<template>
  <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 authForm">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 class="text-xl font-bold leading-tight tracking-tightmd:text-2xl">
        Sign in to your account
      </h1>
      <form class="space-y-4 md:space-y-6" @submit.prevent>
        <div>
          <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
          <input
            type="email"
            v-model="email"
            class="rounded-lg block w-full p-2.5"
            placeholder="name@company.com"
            required
          />
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="••••••••"
            class="rounded-lg block w-full p-2.5"
            required
          />
        </div>
        {{ errorMessage }}
        <button
          @click="login"
          class="w-full focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Sign in
        </button>
        <button
          @click="singInGoogle"
          class="flex flex-wrap justify-center items-center gap-4 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <img src="/src/assets/googleIcon.png" alt="gicon" class="w-6 h-6" />
          Sign in with Google
        </button>
        <p class="text-sm font-light">
          Don't have an account yet?
          <RouterLink to="/register" class="font-medium"> Sign up </RouterLink>
        </p>
      </form>
    </div>
  </div>
  <!-- <h1>Sign In</h1>
  <input placeholder="email" type="email" v-model="email" />
  <input placeholder="password" type="password" v-model="password" />
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <button @click="register">Submit</button>
  <button @click="singGoogle">Sing Google</button>
  <RouterLink to="/register" class="bg-amber-50" @click="singGoogle"
    >No account? Register</RouterLink
  > -->
</template>
