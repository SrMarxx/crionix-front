<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>

<template>
  <section class="user-profile">
    <h2 class="profile-title">Meu Perfil</h2>
    <div v-if="!user" class="profile-loading">
      Carregando dados do perfil...
    </div>
    <div v-else class="profile-card">
      <div class="profile-block">
        <span class="profile-label">ID:</span>
        <span class="profile-value">{{ user.userId }}</span>
      </div>
      <div class="profile-block">
        <span class="profile-label">Nome:</span>
        <span class="profile-value">{{ user.name }}</span>
      </div>
      <div class="profile-block">
        <span class="profile-label">CPF:</span>
        <span class="profile-value">{{ user.cpf }}</span>
      </div>
      <div class="profile-block">
        <span class="profile-label">Nascimento:</span>
        <span class="profile-value">{{ user.nascimento }}</span>
      </div>
      <div class="profile-block">
        <span class="profile-label">Matrícula:</span>
        <span class="profile-value">{{ user.matricula }}</span>
      </div>
      <div class="profile-block">
        <span class="profile-label">E-mail:</span>
        <span class="profile-value">{{ user.email }}</span>
      </div>
      <div class="profile-block">
        <span class="profile-label">Cargo:</span>
        <span class="profile-value">{{ user.cargo }}</span>
      </div>
      <div class="profile-block">
        <span class="profile-label">Troca obrigatória de senha:</span>
        <span class="profile-value">
          <span v-if="user.mustChangePassword" class="profile-alert">Sim</span>
          <span v-else>Não</span>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto 2.6rem auto;
  padding: 2rem 1rem 1rem 1rem;
  background: var(--bg-card, #fff);
  box-shadow: var(--box-shadow-main, 0 2px 24px #0003);
  border-radius: 13px;
}
.profile-title {
  font-size: 1.46rem;
  font-weight: 700;
  color: var(--text-accent, #151922);
  margin-bottom: 2.1rem;
  text-align: left;
}
.profile-loading {
  text-align: center;
  color: var(--text-label, #64748b);
  font-size: 1.08rem;
  margin: 2rem 0;
}
.profile-card {
  display: flex;
  flex-direction: column;
  gap: 1.07rem;
}
.profile-block {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-size: 1.09rem;
  min-width: 0;
  flex-wrap: wrap;
}
.profile-label {
  min-width: 110px;
  font-weight: 600;
  color: var(--text-label, #64748b);
}
.profile-value {
  font-weight: 500;
  color: var(--text-main, #313a44);
  word-break: break-word;
}
.profile-alert {
  background: #feefc3;
  color: #9f5800;
  border-radius: 7px;
  padding: 3.1px 14px;
  font-weight: 700;
  font-size: 0.99em;
}
@media (max-width: 650px) {
  .user-profile {
    padding: 1rem 0.4rem !important;
    max-width: 96vw;
    border-radius: 9px;
  }
  .profile-title { font-size: 1.17rem; }
  .profile-label { min-width: 80px; font-size: 1em;}
}
</style>