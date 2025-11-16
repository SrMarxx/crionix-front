<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ForceChangePassword from '@/components/ForceChangePassword.vue'

type LoginStep = 'form' | 'loading' | 'changePassword'

const authStore = useAuthStore()
const router = useRouter()

const loginStep: Ref<LoginStep> = ref('form')
const matricula: Ref<string> = ref('')
const senha: Ref<string> = ref('')
const errorMessage: Ref<string> = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  loginStep.value = 'loading'
  try {
    await authStore.login(matricula.value, senha.value)
    const userProfile = await authStore.fetchUserProfile()
    if (userProfile?.mustChangePassword) {
      loginStep.value = 'changePassword'
      console.log('User must change password')
    } else {
      console.log('Login successful, redirecting to dashboard')
      console.log('User Profile:', userProfile)
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Login failed: '
    loginStep.value = 'form'
  }
}
const onPasswordChanged = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="fnix-login-bg">
    <div class="fnix-login-card">
      <div class="fnix-login-header">
        <div class="fnix-icon-gradient">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-snowflake h-8 w-8 text-white"
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
        <h1 class="fnix-title">Login</h1>
        <p class="fnix-subtitle">Sistema FrigoNix</p>
      </div>

      <div v-if="loginStep === 'loading'" class="fnix-loading">
        <span class="spinner"></span>
        <p class="fnix-loading-text">Verificando...</p>
      </div>

      <form v-if="loginStep === 'form'" @submit.prevent="handleLogin" class="fnix-login-form">
        <div class="fnix-input-group">
          <label for="matricula">Matrícula</label>
          <div class="fnix-input-wrapper">
            <input
              type="text"
              id="matricula"
              v-model="matricula"
              placeholder="Digite sua matrícula"
              required
            />
            <i class="fas fa-user icon-user"></i>
          </div>
        </div>
        <div class="fnix-input-group">
          <label for="password">Senha</label>
          <div class="fnix-input-wrapper">
            <input
              type="password"
              id="password"
              v-model="senha"
              placeholder="Digite sua senha"
              required
            />
            <i class="fas fa-lock icon-lock"></i>
          </div>
        </div>
        <div v-if="errorMessage" class="fnix-error">{{ errorMessage }}</div>

        <button type="submit" class="fnix-btn-primary">Entrar</button>
      </form>

      <ForceChangePassword
        v-if="loginStep === 'changePassword'"
        @passwordChanged="onPasswordChanged"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.fnix-icon-gradient {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--btn-bg) 15%, var(--btn-bg-hover) 70%);
  box-shadow: 0 2px 12px var(--header-shadow);
}
.fnix-icon-gradient svg {
  color: var(--btn-text);
}
.lucide-snowflake {
  width: 36px;
  height: 36px;
  /* stroke branco pelo atributo stroke="currentColor" no SVG + .fnix-icon-gradient svg color */
}

.fnix-login-bg {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-gradient);
}

.fnix-login-card {
  background: var(--bg-card);
  border-radius: 24px;
  box-shadow: var(--box-shadow-main);
  padding: 2.5rem 2rem;
  width: 370px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border: 1px solid var(--card-border);
}

.fnix-login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.fnix-title {
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 1.7rem;
  color: var(--text-accent);
  margin-top: 10px;
}

.fnix-subtitle {
  font-size: 1rem;
  color: var(--text-subtitle);
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
}

.fnix-login-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.fnix-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.fnix-input-group label {
  color: var(--text-label);
  font-size: 1rem;
}

/* Wrapper para posicionar o ícone corretamente */
.fnix-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Input ocupa todo o espaço horizontal */
.fnix-input-wrapper input {
  width: 100%;
  padding: 0.8em 2.2em 0.8em 1em;
  border-radius: 10px;
  border: 1.5px solid var(--input-border);
  background: var(--bg-input);
  color: var(--text-main);
  font-size: 1rem;
  transition:
    border 0.18s,
    box-shadow 0.18s,
    background 0.15s,
    color 0.15s;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
}

.fnix-input-wrapper input:focus {
  border-color: var(--input-border-focus);
  background: var(--bg-input-focus);
  outline: none;
  box-shadow: 0 0 0 2px var(--input-border-focus);
  color: var(--text-main);
}

.icon-user,
.icon-lock {
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.15rem;
  color: var(--icon-primary);
  opacity: 0.78;
  pointer-events: none;
  transition: color 0.25s;
}

.fnix-input-wrapper input:focus + .icon-user,
.fnix-input-wrapper input:focus + .icon-lock {
  color: var(--icon-secondary);
  opacity: 1;
}

.fnix-error {
  color: var(--text-error);
  background: var(--bg-error);
  padding: 0.5em 1em;
  border-radius: 7px;
  font-size: 0.98rem;
}

.fnix-btn-primary {
  width: 100%;
  padding: 0.9em 0;
  border-radius: 10px;
  border: none;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  font-size: 1.08rem;
  font-weight: 600;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  box-shadow: 0 2px 8px var(--btn-bg);
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.14s;
}

.fnix-btn-primary:hover {
  background-color: var(--btn-bg-hover);
  transform: translateY(-2px) scale(1.01);
}

.fnix-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3.5px solid var(--input-border);
  border-top: 3.5px solid var(--btn-bg);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fnix-loading-text {
  color: var(--text-accent);
  font-size: 1.08rem;
  font-weight: 500;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
}

/* Responsividade básica para mobile */
@media (max-width: 600px) {
  .fnix-login-card {
    width: 96vw;
    padding: 2rem 1rem;
  }
  .fnix-title {
    font-size: 1.2rem;
  }
  .fnix-subtitle {
    font-size: 0.9rem;
  }
  .lucide-snowflake {
    width: 28px;
    height: 28px;
  }
  .fnix-icon-gradient {
    width: 40px;
    height: 40px;
  }
}
</style>
