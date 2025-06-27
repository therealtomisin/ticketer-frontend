// stores/auth.ts
import { defineStore } from 'pinia'
import { apolloClient } from '@/lib/apollo'
import gql from 'graphql-tag'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || '',
  }),
  actions: {
    async login(email: string, password: string) {
      const LOGIN_MUTATION = gql`
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            user {
              id
              firstname
              lastname
              email
            }
            token
            success
            message
          }
        }
      `
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: { email, password, type: 'user' } },
      })

      if (data.login.success) {
        this.token = data.login.token
        localStorage.setItem('auth_token', this.token)
      }

      return { success: data.login.success, message: data.login.message }
    },

    async signup(firstname: string, lastname: string, email: string, password: string) {
      const SIGNUP_MUTATION = gql`
        mutation Signup($input: SignupInput!) {
          signup(input: $input) {
            user {
              id
              firstname
              lastname
              email
            }
            token
            errors
          }
        }
      `
      const { data } = await apolloClient.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { input: { firstname, lastname, email, password } },
      })
      this.token = data.signup.token
      localStorage.setItem('auth_token', this.token)
    },

    logout() {
      this.token = ''
      localStorage.removeItem('auth_token')
    },
  },
})
