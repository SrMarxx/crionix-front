<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const emit = defineEmits(['passwordChanged'])

const senhaAntiga: Ref<string> = ref('')
const novaSenha: Ref<string> = ref('')
const confirmarSenha: Ref<string> = ref('')
const errorMessage: Ref<string> = ref('')
const isSubmitting: Ref<boolean> = ref(false)

const handleSubmit = async () => {
  if (novaSenha.value !== confirmarSenha.value) {
    errorMessage.value = 'A nova senha e a confirmação não coincidem.'
    return
  }
  if (novaSenha.value.length < 8) {
    errorMessage.value = 'A nova senha deve ter pelo menos 8 caracteres.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await authStore.changePassword({
      senhaAntiga: senhaAntiga.value,
      novaSenha: novaSenha.value,
    })
    emit('passwordChanged')
  } catch (error) {
    errorMessage.value = 'Erro ao alterar a senha. Verifique a senha antiga e tente novamente.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="change-password-container">
    <h3>Alteração de senha obrigatória</h3>
    <p>Por segurança, você deve alterar sua senha no primeiro acesso.</p>
    <form @submit.prevent="handleSubmit" class="fnix-login-form">
      <div class="fnix-input-group">
        <label for="old-password">Senha Antiga (Temporária)</label>
        <div class="fnix-input-wrapper">
          <input type="password" v-model="senhaAntiga" id="old-password" required />
          <i class="fas fa-lock icon-lock"></i>
        </div>
      </div>
      <div class="fnix-input-group">
        <label for="new-password">Nova Senha</label>
        <div class="fnix-input-wrapper">
          <input type="password" v-model="novaSenha" id="new-password" required />
          <i class="fas fa-lock icon-lock"></i>
        </div>
      </div>
      <div class="fnix-input-group">
        <label for="confirm-password">Confirme a Nova Senha</label>
        <div class="fnix-input-wrapper">
          <input type="password" v-model="confirmarSenha" id="confirm-password" required />
          <i class="fas fa-lock icon-lock"></i>
        </div>
      </div>
      <div v-if="errorMessage" class="fnix-error">{{ errorMessage }}</div>

      <button type="submit" class="fnix-btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Salvando...' : 'Alterar Senha' }}
      </button>
    </form>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.change-password-container {
  text-align: left;
  width: 100%;
}
h3 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}
p {
  text-align: center;
  color: var(--text-label);
  margin-bottom: 2rem;
  font-size: 0.9em;
}

.fnix-icon-gradient {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #0081f2 10%, #34c9ef 80%);
  box-shadow: 0 2px 12px #0081f245;
}
.fnix-icon-gradient svg {
  color: white;
}
.lucide-snowflake {
  width: 36px;
  height: 36px;
  /* O stroke fica branco pelo atributo stroke="white" no SVG */
}

.fnix-login-bg {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e6f2fe 0%, #ffffff 70%, #9be1ff 100%);
}

.fnix-login-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  padding: 2.5rem 2rem;
  width: 370px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border: 1px solid #ececec;
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
  color: #0081f2;
  margin-top: 10px;
}

.fnix-subtitle {
  font-size: 1rem;
  color: #979faa;
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

/* Wrapper para posicionar o ícone corretamente */
.fnix-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Input ocupa todo o espaço horizontal */
.fnix-input-wrapper input {
  width: 100%;
  padding: 0.8em 2.2em 0.8em 1em; /* espaço extra no lado direito para o ícone */
  border-radius: 10px;
  border: 1.5px solid #d7e2ed;
  background: #f9fbfc;
  color: #24292e;
  font-size: 1rem;
  transition:
    border 0.18s,
    box-shadow 0.18s;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
}

/* Ícone sempre visível à direita e alinhado verticalmente */
.icon-user,
.icon-lock {
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.15rem;
  color: #0081f2;
  opacity: 0.78;
  pointer-events: none;
  transition: color 0.25s;
}

.fnix-input-group label {
  color: #4f5966;
  font-size: 1rem;
}

.fnix-input-group input:focus + .icon-user,
.fnix-input-group input:focus + .icon-lock {
  color: #34322d;
  opacity: 1;
}

.fnix-input-group input:focus {
  border-color: #0081f2;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 2px #0081f228;
}

.fnix-error {
  color: #f25a5a;
  background: #fff5f5;
  padding: 0.5em 1em;
  border-radius: 7px;
  font-size: 0.98rem;
}

.fnix-btn-primary {
  width: 100%;
  padding: 0.9em 0;
  border-radius: 10px;
  border: none;
  background-color: #0081f2;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 600;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  box-shadow: 0 2px 8px #0081f231;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.14s;
}

.fnix-btn-primary:hover {
  background-color: #3ac0ef;
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
  border: 3.5px solid #dadeef;
  border-top: 3.5px solid #0081f2;
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
  color: #0081f2;
  font-size: 1.08rem;
  font-weight: 500;
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
}
</style>
