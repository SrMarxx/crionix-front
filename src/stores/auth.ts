import axios from '@/api/axiosConfig'
import { defineStore } from 'pinia'
import router from '@/router'
import { jwtDecode } from 'jwt-decode'
import type { DecodedToken, UserProfile, ChangePasswordPayload, AuthState } from '@/configs/types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('accessToken') || null,
    user: null,
    permissions: new Set(),
    csrfToken: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    hasPermission: (state) => (permission: string) => state.permissions.has(permission),
  },
  actions: {
    async fetchCsrfToken() {
      try {
        const response = await axios.get('/csrf')
        this.csrfToken = response.data.token
        console.log('CSRF token fetched successfully')
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
        this.csrfToken = null
      }
    },
    async login(matricula: string, password: string): Promise<void> {
      try {
        await this.fetchCsrfToken()
        if (!this.csrfToken) {
          throw new Error('CSRF token is missing. Please try again.')
        }
        const response = await axios.post(
          '/login',
          { matricula, password },
          { headers: { 'X-XSRF-TOKEN': this.csrfToken } },
        )

        const token: string = response.data.accessToken
        this.accessToken = token
        localStorage.setItem('accessToken', token)

        this.fetchUserProfile()
      } catch (error) {
        console.error('Login failed:', error)
        this.logout()
        throw error
      }
    },

    async fetchUserProfile(): Promise<UserProfile | null> {
      if (!this.accessToken) return null
      try {
        const response = await axios.get('/users/me')
        this.user = response.data as UserProfile
        this.decodeAndStorePermissions(this.accessToken)
        return this.user
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        this.logout()
        return null
      }
    },

    async changePassword(payload: ChangePasswordPayload): Promise<void> {
      try {
        await axios.post('/users/change-password', payload)
        if (this.user) {
          this.user.mustChangePassword = false
        }
      } catch (error) {
        console.error('Failed to change password:', error)
        throw error
      }
    },

    decodeAndStorePermissions(token: string) {
      if (!token || token.split('.').length !== 3) {
        return this.logout()
      }
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        this.permissions = new Set(decoded.scope.split(' '))
      } catch (error) {
        console.error('Failed to decode token:', error)
        this.logout()
      }
    },

    async tryToAuthenticate() {
      if (this.accessToken) {
        this.decodeAndStorePermissions(this.accessToken)
        await this.fetchUserProfile()
      }
    },

    logout() {
      this.accessToken = null
      this.user = null
      this.permissions = new Set()
      this.csrfToken = null
      localStorage.removeItem('accessToken')
      router.push('/login')
    },
  },
})
