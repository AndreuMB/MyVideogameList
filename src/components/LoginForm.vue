<script setup lang="ts">
import {
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'registerForm', value: boolean): void
}>()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const login = () => {
  if (!email.value || !password.value) return
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => {
      router.push('/')
    })
    .catch((error: Error) => {
      errorMessage.value = error.message

      switch (error.message) {
        case 'Firebase: Error (auth/invalid-credential).':
          errorMessage.value = 'Email or passwod invalid'
          break
        default:
          errorMessage.value = 'Something went wrong, try again later'
          break
      }
    })
}

const signInGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
    .then(() => {
      router.push('/')
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<template>
  <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 authForm">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 class="text-xl font-bold leading-tight tracking-tightmd:text-2xl">
        Sign in to your account
      </h1>
      <form class="space-y-4 md:space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
          <input
            type="email"
            v-model="email"
            class="rounded-lg block w-full p-2.5 formInput"
            placeholder="name@email.com"
            required
          />
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="••••••••"
            class="rounded-lg block w-full p-2.5 formInput"
            required
          />
        </div>
        <p class="font-bold text-red-800">{{ errorMessage }}</p>
        <button
          type="submit"
          class="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-terciary cursor-pointer"
          value="Sign in"
        >
          Sign in
        </button>
        <button
          type="button"
          @click="signInGoogle"
          class="flex flex-wrap justify-center items-center gap-4 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <img src="/src/assets/googleIcon.png" alt="gicon" class="w-6 h-6" />
          Sign in with Google
        </button>
        <p class="text-sm font-light">
          Don't have an account yet?
          <span
            role="button"
            @click="() => emit('registerForm', true)"
            class="font-medium cursor-pointer"
            >Sign up</span
          >
        </p>
      </form>
    </div>
  </div>
</template>
