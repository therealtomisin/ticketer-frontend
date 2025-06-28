<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Create Ticket</h2>
      <form @submit.prevent="createTicket">
        <input
          v-model="title"
          placeholder="Title"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <textarea
          v-model="content"
          placeholder="Content"
          class="w-full mb-3 p-2 border rounded"
          required
        />
        <!-- <input type="file" multiple @change="handleImages" class="w-full mb-3" /> -->
        <ImageUploader />
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="text-gray-500">Cancel</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTicketsStore } from '@/stores/tickets'
import { ref } from 'vue'
import ImageUploader from './ImageUploader.vue'

const title = ref('')
const content = ref('')
const tickets = useTicketsStore()

// const emit = defineEmits(['close', 'created'])

// const handleImages = (e: Event): void => {
//   const input = e.target as HTMLInputElement
//   if (input?.files) {
//     images.value = Array.from(input.files)
//   }
// }

const createTicket = async () => {
  // Replace with actual submit logic
  //   console.log({ title: title.value, content: content.value, images: images.value })
  try {
    await tickets.createTicket(title.value, content.value)
    title.value = ''
    content.value = ''
  } catch (e) {
    console.log(e)
    // alert("Couldn't create ticket", e.message)
  }
}
</script>
