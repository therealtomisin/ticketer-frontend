// import { apolloClient } from '@/lib/apollo'
// import { gql } from '@apollo/client'
import { defineStore } from 'pinia'

export const useImagesStore = defineStore('images', {
  state: () => ({
    images: [] as string[],
    image: null as string | null,
  }),
  actions: {
    setImage(image: string) {
      this.image = image
    },
  },
})
