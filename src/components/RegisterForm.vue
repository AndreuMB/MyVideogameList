<script setup lang="ts">
import { setUsername } from '@/utils/utils';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'registerForm', value: boolean): void
}>()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((userCredential) => {
      setUsername(userCredential.user.uid,email.value.split('@')[0])
      router.push('/')
    })
    .catch((error: Error) => {
      switch (error.message) {
        case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
          errorMessage.value = 'Password should be at least 6 characters'
          break
        case 'Firebase: Error (auth/email-already-in-use).':
          errorMessage.value = 'Email already in use'
          break
        default:
          errorMessage.value = 'Something went wrong, try again later'
          break
      }
    })
}
</script>

<template>
  <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 authForm">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 class="text-xl font-bold leading-tight tracking-tightmd:text-2xl">Create your account</h1>
      <form class="space-y-4 md:space-y-6" @submit.prevent="register">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium">Your email</label>
          <input
            type="email"
            v-model="email"
            class="rounded-lg block w-full p-2.5"
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
            class="rounded-lg block w-full p-2.5"
            required
          />
        </div>
        <p class="font-bold text-red-800">{{ errorMessage }}</p>
        <button type="submit" class="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Register
        </button>

        <p class="text-sm font-light">
          Do you already have an account?
          <span
            role="button"
            @click="() => emit('registerForm', false)"
            class="font-medium cursor-pointer"
            >Sign in</span
          >
        </p>
      </form>
    </div>
  </div>
</template>
