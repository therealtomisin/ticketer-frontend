<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleMenu"
      class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      ⋮
    </button>

    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
    >
      <div class="py-1">
        <button
          @click="handleView"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          View Details
        </button>
        <button
          @click="handleClose"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          v-if="!isClosed"
        >
          Close Ticket
        </button>
        <button
          @click="handleDelete"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Delete Ticket
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  ticketId: string
  isClosed: boolean
}>()

const emit = defineEmits(['view', 'close', 'delete'])

const handleView = () => {
  emit('view', props.ticketId)
  closeMenu()
}
const handleClose = () => {
  emit('close', props.ticketId)
  closeMenu()
}
const handleDelete = () => {
  emit('delete', props.ticketId)
  closeMenu()
}

const isOpen = ref(false)
const toggleMenu = () => (isOpen.value = !isOpen.value)
const closeMenu = () => (isOpen.value = false)
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
