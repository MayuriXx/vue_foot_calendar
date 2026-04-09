import type { LoginCredentials, AuthResponse, User } from '@/types/user'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulation d'un appel API
      // À remplacer par un vrai appel API
      const response = await new Promise<AuthResponse>((resolve) => {
        setTimeout(() => {
          if (credentials.username && credentials.password.length >= 3) {
            resolve({
              success: true,
              message: 'Connexion réussie',
              user: {
                id: '1',
                username: credentials.username,
                email: `${credentials.username}@example.com`,
              },
              token: 'fake-jwt-token-' + Date.now(),
            })
          } else {
            resolve({
              success: false,
              message: 'Identifiants invalides',
            })
          }
        }, 1000)
      })

      if (response.success && response.user && response.token) {
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion',
      }
    }
  }

  logout(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken')
  }
}

export default new AuthService()
