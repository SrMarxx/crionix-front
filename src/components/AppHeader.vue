<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)
const isMobile = ref(window.innerWidth <= 600)
const configOpen = ref(false)

function goTo(path: string) {
  menuOpen.value = false
  router.push(path)
}

function handleResize() {
  isMobile.value = window.innerWidth <= 600
  if (!isMobile.value) menuOpen.value = false
}
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))
function toggleConfigMenu() {
  configOpen.value = !configOpen.value
}
function toggleDarkMode() {
  themeStore.toggle()
  configOpen.value = false
}

const darkMode = computed(() => themeStore.dark)

const menuConfigRef = ref(null)
onClickOutside(menuConfigRef, () => {
  configOpen.value = false
})
</script>

<template>
  <header class="fnix-header">
    <div class="container">
      <div class="flex-logo-title">
        <div class="fnix-logo-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-snowflake"
            aria-hidden="true"
          >
            <path d="m10 20-1.25-2.5L6 18"></path>
            <path d="M10 4 8.75 6.5 6 6"></path>
            <path d="m14 20 1.25-2.5L18 18"></path>
            <path d="m14 4 1.25 2.5L18 6"></path>
            <path d="m17 21-3-6h-4"></path>
            <path d="m17 3-3 6 1.5 3"></path>
            <path d="M2 12h6.5L10 9"></path>
            <path d="m20 10-1.5 2 1.5 2"></path>
            <path d="M22 12h-6.5L14 15"></path>
            <path d="m4 10 1.5 2L4 14"></path>
            <path d="m7 21 3-6-1.5-3"></path>
            <path d="m7 3 3 6h4"></path>
          </svg>
        </div>
        <div>
          <h1 class="fnix-header-title">FrigoNix</h1>
          <p class="fnix-header-subtitle">Sistema de Gestão de Freezers</p>
        </div>
      </div>
      <div class="flex-user-buttons">
        <div class="fnix-config-menu-wrapper" ref="menuConfigRef">
          <button class="fnix-header-btn" @click="toggleConfigMenu">
            <i class="fa-solid fa-gear"></i>
            <span class="fnix-header-btn-label">Configurações</span>
          </button>
          <div v-if="configOpen" class="fnix-config-menu-pop">
            <button class="config-menu-item" @click="toggleDarkMode">
              <i class="fa-solid" :class="darkMode ? 'fa-sun' : 'fa-moon'"></i>
              <span class="menu-text">Modo {{ darkMode ? 'Claro' : 'Escuro' }}</span>
            </button>
            <button class="config-menu-item logout-button" @click="authStore.logout">
              <i class="fas fa-sign-out-alt"></i>
              <span class="menu-text">Sair</span>
            </button>
          </div>
        </div>
        <button class="fnix-header-btn-circle" @click="goTo('/profile')">
          <i class="fa-solid fa-user"></i>        
        </button>
        <button
          class="fnix-header-burger"
          @click="menuOpen = !menuOpen"
          v-show="isMobile"
          aria-label="Abrir menu"
        >
          <i class="fa fa-bars"></i>
        </button>
      </div>
      <div v-if="menuOpen && isMobile" class="fnix-mobile-menu">
        <button @click="goTo('/config')"><i class="fa-solid fa-gear"></i> Configurações</button>
        <button @click="goTo('/profile')"><i class="fa-solid fa-user"></i> Perfil</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

/* Header */
.fnix-header {
  background: var(--bg-card);
  border-bottom: 1.5px solid var(--card-border);
  box-shadow: 0 2px 12px var(--header-shadow);
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2.5rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.flex-logo-title {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}
.fnix-logo-circle {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--btn-bg) 15%, var(--btn-bg-hover) 70%);
  box-shadow: 0 2px 12px var(--header-shadow);
}
.lucide-snowflake {
  width: 32px;
  height: 32px;
  color: var(--btn-text);
}
.fnix-header-title {
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 1.45rem;
  color: var(--text-accent);
  margin: 0;
  margin-bottom: 2px;
}
.fnix-header-subtitle {
  font-size: 0.96rem;
  color: var(--text-subtitle);
  margin: 0;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
}
.flex-user-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Menu Configurações Popover */
.fnix-config-menu-wrapper {
  position: relative;
  display: inline-block;
}
.fnix-config-menu-pop {
  position: absolute;
  right: 0;
  top: 43px;
  width: 175px;
  background: var(--bg-card);
  border: 1.5px solid var(--card-border);
  border-radius: 12px;
  box-shadow: 0 4px 24px var(--header-shadow);
  z-index: 200;
  display: flex;
  flex-direction: column;
  animation: fade-in 0.28s;
}
.config-menu-item {
  background: none;
  border: none;
  padding: 13px 15px;
  font-size: 1rem;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  color: var(--text-accent);
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 10px;
  transition:
    background 0.17s,
    color 0.14s;
}
.config-menu-item:hover {
  background: var(--bg-input);
  color: var(--btn-bg-hover);
}
.logout-button {
  color: var(--text-error);
}
.logout-button:hover {
  background: var(--bg-error);
  color: #b51c14; /* vermelho mais escuro pode ser uma nova variável, ex: --text-error-hover */
}
.menu-text {
  flex: 1 1 auto;
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Desktop/config/profile buttons */
.fnix-header-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 16px;
  height: 39px;
  font-size: 1rem;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  background: linear-gradient(90deg, var(--bg-input) 60%, var(--bg-main) 100%);
  color: var(--text-accent);
  border: 1px solid var(--input-border);
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 6px var(--header-shadow);
  transition:
    background 0.22s,
    box-shadow 0.18s,
    transform 0.11s;
}
.fnix-header-btn:hover {
  background: linear-gradient(90deg, var(--btn-bg-hover) 60%, var(--btn-bg) 100%);
  color: var(--btn-text);
  transform: scale(1.03) translateY(-2.5px);
}
.fnix-header-btn-label {
  display: inline-block;
}
.fnix-header-btn-circle {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--btn-bg) 15%, var(--btn-bg-hover) 70%);
  color: var(--btn-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  border: none;
  box-shadow: 0 2px 8px var(--header-shadow);
  cursor: pointer;
  transition:
    background 0.22s,
    transform 0.13s;
}
.fnix-header-btn-circle:hover {
  background: linear-gradient(135deg, var(--btn-bg-hover) 12%, var(--btn-bg) 90%);
  transform: scale(1.09) translateY(-1.5px);
}
.fnix-header-btn-circle i {
  transform: translateX(6.5px);
}

/* Hamburger button (mobile only) */
.fnix-header-burger {
  background: none;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  align-items: center;
  padding: 0;
  cursor: pointer;
  margin-left: 6px;
  transition: background 0.16s;
  color: var(--btn-bg);
}
.fnix-header-burger span {
  width: 22px;
  height: 3px;
  border-radius: 2px;
  background: var(--btn-bg);
  display: block;
  transition: all 0.18s;
}

/* Mobile menu (hamburger) */
.fnix-mobile-menu {
  position: absolute;
  right: 16px;
  top: 60px;
  z-index: 100;
  background: var(--bg-card);
  border: 1.5px solid var(--card-border);
  border-radius: 10px;
  box-shadow: 0 4px 16px var(--header-shadow);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 145px;
  animation: fade-in 0.3s;
}
.fnix-mobile-menu button {
  background: none;
  border: none;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  font-size: 1.01rem;
  color: var(--text-accent);
  padding: 11px 19px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 9px;
  border-radius: 10px;
  transition:
    background 0.17s,
    color 0.14s;
}
.fnix-mobile-menu button:hover {
  background: var(--bg-input);
  color: var(--btn-bg-hover);
}

/* Responsividade para tablets */
@media (max-width: 900px) {
  .container {
    padding: 0 1rem;
    max-width: 100vw;
  }
  .fnix-header-title {
    font-size: 1.2rem;
  }
  .fnix-header-subtitle {
    font-size: 0.87rem;
  }
}

/* Responsividade para mobile + hamburger trigger */
@media (max-width: 600px) {
  .container {
    flex-direction: column;
    height: auto;
    gap: 0.2rem;
    padding: 0 0.6rem;
    align-items: flex-start;
  }
  .flex-logo-title {
    gap: 0.9rem;
  }
  .flex-user-buttons {
    width: 100%;
    justify-content: flex-end;
    margin-top: 6px;
    gap: 0.5rem;
  }
  .fnix-logo-circle {
    width: 38px;
    height: 38px;
  }
  .lucide-snowflake {
    width: 26px;
    height: 26px;
  }
  .fnix-header-title {
    font-size: 1.06rem;
    margin-bottom: 0px;
  }
  .fnix-header-subtitle {
    font-size: 0.77rem;
  }
  .fnix-header-btn,
  .fnix-header-btn-circle {
    display: none !important;
  }
  .fnix-header-burger {
    display: flex !important;
  }
}
@media (min-width: 601px) {
  .fnix-header-burger,
  .fnix-mobile-menu {
    display: none !important;
  }
}
</style>
