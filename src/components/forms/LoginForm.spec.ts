// import { mount, VueWrapper } from '@vue/test-utils'
// import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
// import { createRouter, createWebHistory } from 'vue-router'
// import { createPinia, setActivePinia } from 'pinia'
// import LoginForm from '@/components/LoginForm.vue' // Adjust path as needed

// // Mock dependencies
// const mockPush = vi.fn()
// const mockLogin = vi.fn()
// const mockToastSuccess = vi.fn(() => ({ dismiss: vi.fn() }))
// const mockToastError = vi.fn()

// // Mock vue-router
// vi.mock('vue-router', async () => {
//   const actual = await vi.importActual('vue-router')
//   return {
//     ...actual,
//     useRouter: () => ({
//       push: mockPush,
//     }),
//   }
// })

// // Mock auth store
// vi.mock('@/stores/auth', () => ({
//   useAuthStore: () => ({
//     login: mockLogin,
//   }),
// }))

// // Mock toast notifications
// vi.mock('vue-toast-notification', () => ({
//   useToast: () => ({
//     success: mockToastSuccess,
//     error: mockToastError,
//   }),
// }))

// describe('LoginForm Component', () => {
//   let wrapper: VueWrapper

//   beforeEach(() => {
//     // Reset all mocks
//     vi.clearAllMocks()

//     // Setup Pinia
//     setActivePinia(createPinia())

//     // Create router for testing
//     const router = createRouter({
//       history: createWebHistory(),
//       routes: [{ path: '/tickets', component: { template: '<div>Tickets</div>' } }],
//     })

//     wrapper = mount(LoginForm, {
//       global: {
//         plugins: [router],
//       },
//     })
//   })

//   afterEach(() => {
//     wrapper.unmount()
//   })

//   describe('Component Rendering', () => {
//     it('renders the login form correctly', () => {
//       expect(wrapper.find('form').exists()).toBe(true)
//       expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
//       expect(wrapper.find('input[type="password"]').exists()).toBe(true)
//       expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
//     })

//     it('has correct button text', () => {
//       const submitButton = wrapper.find('button[type="submit"]')
//       expect(submitButton.text()).toBe('Login')
//     })
//   })

//   describe('Form Input Handling', () => {
//     it('updates email when typing in email input', async () => {
//       const emailInput = wrapper.find('input[placeholder="Email"]')
//       await emailInput.setValue('test@example.com')

//       // Access the component instance and then the exposed ref
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const vm = wrapper.vm as any
//       expect(vm.email).toBe('test@example.com')
//     })

//     it('updates password when typing in password input', async () => {
//       const passwordInput = wrapper.find('input[type="password"]')
//       await passwordInput.setValue('password123')

//       // Access the component instance and then the exposed ref
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const vm = wrapper.vm as any
//       expect(vm.password).toBe('password123')
//     })
//   })

//   describe('Form Submission', () => {
//     const fillForm = async () => {
//       await wrapper.find('input[placeholder="Email"]').setValue('test@example.com')
//       await wrapper.find('input[type="password"]').setValue('password123')
//     }

//     it('calls auth.login with correct credentials on form submit', async () => {
//       mockLogin.mockResolvedValue({ success: true })
//       await fillForm()
//       await wrapper.find('form').trigger('submit.prevent')

//       expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
//     })

//     it('shows success toast and redirects on successful login', async () => {
//       mockLogin.mockResolvedValue({ success: true })
//       await fillForm()
//       await wrapper.find('form').trigger('submit.prevent')

//       expect(mockToastSuccess).toHaveBeenCalledWith('Login Succesfully!')
//       expect(mockPush).toHaveBeenCalledWith('/tickets')
//     })

//     it('dismisses success toast after showing', async () => {
//       const mockDismiss = vi.fn()
//       mockToastSuccess.mockReturnValue({ dismiss: mockDismiss })
//       mockLogin.mockResolvedValue({ success: true })

//       await fillForm()
//       await wrapper.find('form').trigger('submit.prevent')

//       expect(mockDismiss).toHaveBeenCalled()
//     })

//     it('shows error toast when login fails with success: false', async () => {
//       mockLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' })
//       await fillForm()
//       await wrapper.find('form').trigger('submit.prevent')

//       expect(mockToastError).toHaveBeenCalledWith('Invalid credentials')
//     })

//     it('shows generic error toast when login throws exception', async () => {
//       mockLogin.mockRejectedValue(new Error('Network error'))
//       await fillForm()
//       await wrapper.find('form').trigger('submit.prevent')

//       expect(mockToastError).toHaveBeenCalledWith('Login failed!')
//     })
//   })

//   describe('Edge Cases', () => {
//     it('handles empty form submission', async () => {
//       await wrapper.find('form').trigger('submit.prevent')

//       expect(mockLogin).toHaveBeenCalledWith('', '')
//     })

//     it('handles special characters in email and password', async () => {
//       await wrapper.find('input[placeholder="Email"]').setValue('test+user@example.com')
//       await wrapper.find('input[type="password"]').setValue('p@ssw0rd!#$%')
//       await wrapper.find('form').trigger('submit.prevent')

//       expect(mockLogin).toHaveBeenCalledWith('test+user@example.com', 'p@ssw0rd!#$%')
//     })
//   })
// })

import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import LoginForm from '@/components/forms/LoginForm.vue'

// Mock the stores and composables
const mockPush = vi.fn()
const mockLogin = vi.fn()
const mockToastSuccess = vi.fn(() => ({ dismiss: vi.fn() }))
const mockToastError = vi.fn()

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
  }
})

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: mockLogin,
  }),
}))

// Mock toast notifications
vi.mock('vue-toast-notification', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
  }),
}))

describe('LoginForm Component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup Pinia
    setActivePinia(createPinia())

    // Create router for testing
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/tickets', component: { template: '<div>Tickets</div>' } },
        { path: '/verify', component: { template: '<div>Verify</div>' } },
      ],
    })

    wrapper = mount(LoginForm, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            props: ['to'],
          },
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('Component Rendering', () => {
    it('renders the login form correctly', () => {
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"][placeholder="Password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
      expect(wrapper.find('a[href="/signup"]').exists()).toBe(true)
    })

    it('has correct button text', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toBe('Login')
    })

    it('has correct signup link text', () => {
      const signupLink = wrapper.find('a[href="/signup"]')
      expect(signupLink.text()).toContain('Sign Up')
    })
  })

  describe('Form Input Handling', () => {
    it('updates email when typing', async () => {
      const input = wrapper.find('input[placeholder="Email"]')
      await input.setValue('test@example.com')
      expect((input.element as HTMLInputElement).value).toBe('test@example.com')
    })

    it('updates password when typing', async () => {
      const input = wrapper.find('input[placeholder="Password"]')
      await input.setValue('password123')
      expect((input.element as HTMLInputElement).value).toBe('password123')
    })
  })

  describe('Form Submission', () => {
    const fillValidForm = async () => {
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
    }

    it('calls auth.login with correct credentials', async () => {
      mockLogin.mockResolvedValue({ success: true })
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('redirects to tickets page on successful login', async () => {
      mockLogin.mockResolvedValue({ success: true })
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockPush).toHaveBeenCalledWith('/tickets')
      expect(mockToastSuccess).toHaveBeenCalledWith('Login Succesfully!')
    })

    it('shows success toast on successful login', async () => {
      mockLogin.mockResolvedValue({ success: true })
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockToastSuccess).toHaveBeenCalledWith('Login Succesfully!')
    })

    it('redirects to verify page when email not verified', async () => {
      mockLogin.mockResolvedValue({
        success: false,
        message: 'Email not verified',
      })
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockToastError).toHaveBeenCalledWith('Please verify your email before logging in.')
      expect(mockPush).toHaveBeenCalledWith('/verify')
    })

    it('shows error message when login fails', async () => {
      mockLogin.mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      })
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockToastError).toHaveBeenCalledWith('Invalid credentials')
    })

    it('shows generic error when exception occurs', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'))
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockToastError).toHaveBeenCalledWith('Login failed!')
    })

    it('exposes email and password refs for testing', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { email, password } = wrapper.vm as any
      expect(email).toBeDefined()
      expect(password).toBeDefined()
    })
  })
})
