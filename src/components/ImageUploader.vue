<!-- <template>
  <div>
    <input type="file" @change="handleFileUpload" accept="image/*" />
    <button @click="uploadImage" :disabled="!file">Upload</button>
    <img v-if="imageUrl" :src="imageUrl" class="preview-image" />
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useImagesStore } from '@/stores/images'

// GraphQL mutation

// Reactive state
const file = ref<File | null>(null)
const imageUrl = ref('')
const error = ref('')
const imageStore = useImagesStore()

// Apollo mutation

// Methods
const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    imageUrl.value = URL.createObjectURL(file.value)
  }
}
const uploadImage = async () => {
  await imageStore.uploadImage(file)
}
</script>

<style scoped>
.preview-image {
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
}
</style> -->

<template>
  <div class="space-y-4">
    <input type="file" @change="handleFileChange" />
    <div v-if="imageUrl">
      <p class="text-sm text-gray-500">Uploaded image:</p>
      <img :src="imageUrl" alt="Uploaded" class="w-64 rounded shadow" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImagesStore } from '@/stores/images'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
const imageStore = useImagesStore()
const $toast = useToast()

const imageUrl = ref<string | null>(null)

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) // replace with your preset

  try {
    const res = await fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (data.error) {
      $toast.error(`Upload failed`)
    } else {
      imageUrl.value = data.secure_url
      imageStore.setImage(data.secure_url)
    }
  } catch (err) {
    console.error('Upload failed:', err)
  }
}
</script>
