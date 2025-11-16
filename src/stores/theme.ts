import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    dark: false,
  }),
  actions: {
    initTheme() {
      const saved = localStorage.getItem('theme')
      if (
        saved === 'dark' ||
        (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.dark = true
        document.documentElement.classList.add('dark')
      } else {
        this.dark = false
        document.documentElement.classList.remove('dark')
      }
    },
    toggle() {
      this.dark = !this.dark
      document.documentElement.classList.toggle('dark', this.dark)
      localStorage.setItem('theme', this.dark ? 'dark' : 'light')
    },
  },
})
