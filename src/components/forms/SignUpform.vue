<!-- <template>
  <form @submit.prevent="handleSignup" class="space-y-4">
    <input v-model="firstName" placeholder="First Name" class="w-full p-2 border rounded" />
    <input v-model="lastName" placeholder="Last Name" class="w-full p-2 border rounded" />
    <input v-model="email" placeholder="Email" class="w-full p-2 border rounded" />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="w-full p-2 border rounded"
    />
    <input
      v-model="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      class="w-full p-2 border rounded"
    />
    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Sign Up</button>
  </form>
</template> -->

<template>
  <form @submit.prevent="handleSignup" class="space-y-4">
    <div>
      <input v-model="firstName" placeholder="First Name" class="w-full p-2 border rounded" />
      <p v-if="firstNameError" class="text-red-500 text-sm">{{ firstNameError }}</p>
    </div>

    <div>
      <input v-model="lastName" placeholder="Last Name" class="w-full p-2 border rounded" />
      <p v-if="lastNameError" class="text-red-500 text-sm">{{ lastNameError }}</p>
    </div>

    <div>
      <input v-model="email" placeholder="Email" class="w-full p-2 border rounded" />
      <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>
    </div>

    <div>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 border rounded"
      />
      <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
    </div>

    <div>
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="w-full p-2 border rounded"
      />
      <p v-if="confirmPasswordError" class="text-red-500 text-sm">{{ confirmPasswordError }}</p>
    </div>

    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Sign Up</button>

    <p class="text-sm text-gray-500">
      Already have an account? <a href="/login" class="text-indigo-600">Log in</a>
    </p>
  </form>
</template>

<!-- <script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('Passwords do not match')
    return
  }

  try {
    const auth = await authStore.signup(
      firstName.value,
      lastName.value,
      email.value,
      password.value,
    )

    if (auth.success) {
      router.push('/verify')
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      toast.error('Signup failed')
    } else {
      toast.error('Signup failed: Unknown error')
    }
  }
}
</script> -->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Computed validations
const firstNameError = computed(() => !firstName.value.trim() && 'First name is required')
const lastNameError = computed(() => !lastName.value.trim() && 'Last name is required')
const emailError = computed(() =>
  !email.value.trim() ? 'Email is required' : !emailRegex.test(email.value) ? 'Invalid email' : '',
)
const passwordError = computed(() =>
  password.value.length < 6 ? 'Password must be at least 6 characters' : '',
)
const confirmPasswordError = computed(() =>
  confirmPassword.value !== password.value ? 'Passwords do not match' : '',
)

const handleSignup = async () => {
  if (
    firstNameError.value ||
    lastNameError.value ||
    emailError.value ||
    passwordError.value ||
    confirmPasswordError.value
  ) {
    toast.error('Please fix form errors before submitting')
    return
  }

  try {
    const auth = await authStore.signup(
      firstName.value.trim(),
      lastName.value.trim(),
      email.value.trim(),
      password.value,
    )

    if (auth.success) {
      router.push('/verify')
    } else {
      toast.error(auth.message || 'Signup failed')
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      toast.error(e.message || 'Signup failed')
    } else {
      toast.error('Signup failed: Unknown error')
    }
  }
}
</script>
