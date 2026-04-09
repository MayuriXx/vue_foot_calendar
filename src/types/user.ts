export interface User {
  id: string
  username: string
  email?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}
