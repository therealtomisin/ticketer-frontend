// stores/auth.ts
import { defineStore } from 'pinia'
import { apolloClient } from '@/lib/apollo'
import gql from 'graphql-tag'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('auth_token') || '',
    currentUser: null,
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
        this.currentUser = data.login.agent
        sessionStorage.setItem('auth_token', this.token)
        sessionStorage.setItem('currentUser', data.login.agent)
      }

      return { success: data.login.success, message: data.login.message }
    },

    async signup(firstname: string, lastname: string, email: string, password: string) {
      const SIGNUP_MUTATION = gql`
        mutation Signup($input: SignupInput!) {
          signup(input: $input) {
            token
            message
            success
            expiresIn
          }
        }
      `
      const { data } = await apolloClient.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { input: { firstname, lastname, email, password, type: 'user' } },
      })

      if (data.signup.success) {
        this.token = data.signup.token
        localStorage.setItem('code', this.token)
      } else {
        console.error(data.signup.message)
      }

      return { success: data.signup.success, message: data.signup.message }
    },

    logout() {
      this.token = ''
      localStorage.removeItem('auth_token')
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async verifyToken({ code, token }: any) {
      console.log('verifying token with code:', code, 'and token:', token)

      const VERIFY_TOKEN_MUTATION = gql`
        mutation VerifyToken($input: VerifyTokenInput!) {
          verifyToken(input: $input) {
            success
            message
          }
        }
      `

      const { data } = await apolloClient.mutate({
        mutation: VERIFY_TOKEN_MUTATION,
        variables: { input: { code, token } },
      })

      return { success: data.verifyToken.success, message: data.verifyToken.message }
    },
  },
})
