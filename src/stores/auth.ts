import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '@/types/user'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)

      if (response.success && response.user && response.token) {
        user.value = response.user
        token.value = response.token
        return { success: true }
      } else {
        error.value = response.message || 'Erreur de connexion'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Erreur inattendue'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    token.value = null
    error.value = null
  }

  function initializeAuth() {
    const currentUser = authService.getCurrentUser()
    const authToken = localStorage.getItem('authToken')

    if (currentUser && authToken) {
      user.value = currentUser
      token.value = authToken
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    token,

    // Computed
    isAuthenticated,

    // Actions
    login,
    logout,
    initializeAuth,
  }
})
