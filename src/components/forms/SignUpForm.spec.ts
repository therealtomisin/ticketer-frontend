import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import SignUpForm from '@/components/forms/SignUpform.vue'

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
    signup: mockSignUp,
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
      expect(wrapper.find('a[href="/login"]').exists()).toBe(true)
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

    it('shows error when first name is empty', async () => {
      const input = wrapper.find('input[placeholder="First Name"]')
      await input.setValue('')
      await input.trigger('blur')
      expect(wrapper.find('[data-testid="first-name-error"]').exists()).toBe(true)
    })

    it('updates last name when typing', async () => {
      const input = wrapper.find('input[placeholder="Last Name"]')
      await input.setValue('Doe')
      expect((input.element as HTMLInputElement).value).toBe('Doe')
    })

    it('shows error when last name is empty', async () => {
      const input = wrapper.find('input[placeholder="Last Name"]')
      await input.setValue('')
      await input.trigger('blur')
      expect(wrapper.find('[data-testid="last-name-error"]').exists()).toBe(true)
    })

    it('updates email when typing', async () => {
      const input = wrapper.find('input[placeholder="Email"]')
      await input.setValue('test@example.com')
      expect((input.element as HTMLInputElement).value).toBe('test@example.com')
    })

    it('shows error when email is invalid', async () => {
      const input = wrapper.find('input[placeholder="Email"]')
      await input.setValue('invalid-email')
      await input.trigger('blur')
      expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(true)
    })

    it('updates password when typing', async () => {
      const input = wrapper.find('input[placeholder="Password"]')
      await input.setValue('password123')
      expect((input.element as HTMLInputElement).value).toBe('password123')
    })

    it('shows error when password is too short', async () => {
      const input = wrapper.find('input[placeholder="Password"]')
      await input.setValue('12345')
      await input.trigger('blur')
      expect(wrapper.find('[data-testid="password-error"]').exists()).toBe(true)
    })

    it('updates confirm password when typing', async () => {
      const input = wrapper.find('input[placeholder="Confirm Password"]')
      await input.setValue('password123')
      expect((input.element as HTMLInputElement).value).toBe('password123')
    })
  })

  describe('Form Validation', () => {
    it('prevents submission with empty first name', async () => {
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')
      expect(mockSignUp).not.toHaveBeenCalled()
      expect(mockToastError).toHaveBeenCalledWith('Please fix form errors before submitting')
    })

    it('prevents submission with invalid email', async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('invalid-email')
      await wrapper.find('input[placeholder="Password"]').setValue('password123')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')
      expect(mockSignUp).not.toHaveBeenCalled()
      expect(mockToastError).toHaveBeenCalledWith('Please fix form errors before submitting')
    })

    it('prevents submission with short password', async () => {
      await wrapper.find('input[placeholder="First Name"]').setValue('John')
      await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
      await wrapper.find('input[placeholder="Email"]').setValue('test@example.com')
      await wrapper.find('input[placeholder="Password"]').setValue('12345')
      await wrapper.find('input[placeholder="Confirm Password"]').setValue('12345')

      await wrapper.find('form').trigger('submit.prevent')
      expect(mockSignUp).not.toHaveBeenCalled()
      expect(mockToastError).toHaveBeenCalledWith('Please fix form errors before submitting')
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

    it('calls auth.signup with correct data on form submit', async () => {
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
      expect(mockToastError).toHaveBeenCalledWith('Please fix form errors before submitting')
    })

    it('shows error toast on signup failure', async () => {
      mockSignUp.mockRejectedValue(new Error('Signup failed'))
      await fillValidForm()
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockToastError).toHaveBeenCalledWith('Signup failed')
    })
  })
})
