// import { render, fireEvent } from '@testing-library/vue'
// // import { createTestingPinia } from '@pinia/testing'
// import { beforeEach, describe, expect, it, vi } from 'vitest'
// import { createRouter, createWebHistory } from 'vue-router'
// import SignUpForm from './SignUpform.vue'
// import { createTestingPinia } from '@pinia/testing'

// // Mock vue-toast-notification
// vi.mock('vue-toast-notification', () => ({
//   useToast: () => ({
//     error: vi.fn(),
//   }),
// }))

// describe('SignUpForm.vue', () => {
//   const toastError = vi.fn()

//   const router = createRouter({
//     history: createWebHistory(),
//     routes: [{ path: '/verify', name: 'Verify', component: { template: 'Verify' } }],
//   })

//   beforeEach(() => {
//     // Reset the toast mock
//     vi.mocked(import('vue-toast-notification').useToast).mockReturnValue({ error: toastError })
//     toastError.mockReset()
//   })

//   it('shows an error if passwords do not match', async () => {
//     const { getByPlaceholderText, getByText } = render(SignUpForm, {
//       global: {
//         plugins: [
//           createTestingPinia({
//             createSpy: vi.fn,
//           }),
//           router,
//         ],
//       },
//     })

//     await fireEvent.update(getByPlaceholderText('First Name'), 'Timi')
//     await fireEvent.update(getByPlaceholderText('Last Name'), 'Eribake')
//     await fireEvent.update(getByPlaceholderText('Email'), 'timi@example.com')
//     await fireEvent.update(getByPlaceholderText('Password'), 'password123')
//     await fireEvent.update(getByPlaceholderText('Confirm Password'), 'wrongpass')

//     await fireEvent.click(getByText('Sign Up'))

//     expect(toastError).toHaveBeenCalledWith('Passwords do not match')
//   })

//   it('calls signup and navigates to /verify on success', async () => {
//     const signupMock = vi.fn().mockResolvedValue({ success: true })

//     const { getByPlaceholderText, getByText } = render(SignUpForm, {
//       global: {
//         plugins: [
//           createTestingPinia({
//             createSpy: vi.fn(() => signupMock),
//             stubActions: false,
//           }),
//           router,
//         ],
//       },
//     })

//     await fireEvent.update(getByPlaceholderText('First Name'), 'Timi')
//     await fireEvent.update(getByPlaceholderText('Last Name'), 'Eribake')
//     await fireEvent.update(getByPlaceholderText('Email'), 'timi@example.com')
//     await fireEvent.update(getByPlaceholderText('Password'), 'password123')
//     await fireEvent.update(getByPlaceholderText('Confirm Password'), 'password123')

//     // Mock router.push
//     const pushSpy = vi.spyOn(router, 'push')

//     await fireEvent.click(getByText('Sign Up'))

//     expect(signupMock).toHaveBeenCalledWith('Timi', 'Eribake', 'timi@example.com', 'password123')
//     expect(pushSpy).toHaveBeenCalledWith('/verify')
//   })

//   it('shows toast error on signup failure', async () => {
//     const signupMock = vi.fn().mockRejectedValue(new Error('Signup failed'))

//     const { getByPlaceholderText, getByText } = render(SignUpForm, {
//       global: {
//         plugins: [
//           createTestingPinia({
//             createSpy: vi.fn(() => signupMock),
//             stubActions: false,
//           }),
//           router,
//         ],
//       },
//     })

//     await fireEvent.update(getByPlaceholderText('First Name'), 'Timi')
//     await fireEvent.update(getByPlaceholderText('Last Name'), 'Eribake')
//     await fireEvent.update(getByPlaceholderText('Email'), 'timi@example.com')
//     await fireEvent.update(getByPlaceholderText('Password'), 'password123')
//     await fireEvent.update(getByPlaceholderText('Confirm Password'), 'password123')

//     await fireEvent.click(getByText('Sign Up'))

//     expect(signupMock).toHaveBeenCalled()
//     expect(toastError).toHaveBeenCalledWith('Signup failed')
//   })
// })

import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import SignUpForm from '@/components/forms/SignUpform.vue' // Adjust path as needed

// Mock the stores and composables
const mockPush = vi.fn()
const mockSignUp = vi.fn().mockResolvedValue({ success: true })
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
    signUp: mockSignUp,
  }),
}))

// Mock toast notifications
vi.mock('vue-toast-notification', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
  }),
}))

describe('SignUp Component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup Pinia
    setActivePinia(createPinia())

    // Create router for testing
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/verify', component: { template: '<div>Verify</div>' } }],
    })

    wrapper = mount(SignUpForm, {
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
    it('renders the signup form correctly', () => {
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="First Name"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Last Name"]').exists()).toBe(true)
      expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"][placeholder="Password"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"][placeholder="Confirm Password"]').exists()).toBe(
        true,
      )
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('has correct button text', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toBe('Sign Up')
    })
  })

  describe('Form Input Handling', () => {
    it('updates first name when typing', async () => {
      const input = wrapper.find('input[placeholder="First Name"]')
      await input.setValue('John')
      expect((input.element as HTMLInputElement).value).toBe('John')
    })

    it('updates last name when typing', async () => {
      const input = wrapper.find('input[placeholder="Last Name"]')
      await input.setValue('Doe')
      expect((input.element as HTMLInputElement).value).toBe('Doe')
    })

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

    it('updates confirm password when typing', async () => {
      const input = wrapper.find('input[placeholder="Confirm Password"]')
      await input.setValue('password123')
      expect((input.element as HTMLInputElement).value).toBe('password123')
    })
  })

  describe('Form Submission', () => {
    const fillValidForm = async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')
    }

    it('calls auth.signUp with correct data on form submit', async () => {
      mockSignUp.mockResolvedValue({ success: true })
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockSignUp).toHaveBeenCalledWith('John', 'Doe', 'test@example.com', 'password123')
    })

    it('redirects to verify page on successful signup', async () => {
      mockSignUp.mockResolvedValue({ success: true })
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockPush).toHaveBeenCalledWith('/verify')
    })

    it('shows error when passwords do not match', async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('different')

      await wrapper.find('form').trigger('submit.prevent')

      expect(mockSignUp).not.toHaveBeenCalled()
      expect(mockToastError).toHaveBeenCalledWith('Passwords do not match')
    })

    it('shows error toast on signup failure', async () => {
      mockSignUp.mockRejectedValue(new Error('Signup failed'))
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockToastError).toHaveBeenCalledWith('Signup failed')
    })
  })
})
