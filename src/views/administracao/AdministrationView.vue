<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const adminOptions = [
  {
    title: 'Gerenciar Usuários',
    icon: 'fa-users-cog', // FontAwesome
    description: 'Adicione, edite e controle os usuários do sistema.',
    path: '/administration/users'
  },
  {
    title: 'Gerenciar Máquinas',
    icon: 'fa-tools', // FontAwesome
    description: 'Cadastre e edite os equipamentos registrados.',
    path: '/administration/machines'
  },
  {
    title: 'Gerenciar Sensores',
    icon: 'fa-microchip', // FontAwesome
    description: 'Configure e gerencie sensores conectados.',
    path: '/administration/sensors'
  }
]

function goTo(url:string) {
  router.push(url)
}
</script>

<template>
  <section class="admin-dashboard">
    <div class="admin-card-grid">
      <button
        v-for="item in adminOptions"
        :key="item.title"
        class="admin-card"
        @click="goTo(item.path)"
      >
        <i :class="['fas', item.icon, 'admin-card-icon']"></i>
        <span class="admin-card-title">{{ item.title }}</span>
        <span class="admin-card-desc">{{ item.description }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.admin-dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.2rem;
  box-sizing: border-box;
}

.admin-title {
  text-align: center;
  font-size: 2rem;
  color: var(--text-accent);
  margin: 1.5rem 0 2.2rem 0;
  font-weight: 700;
}

.admin-card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.2rem;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;        /* Protege de overflow em desktops */
}

.admin-card {
  background: var(--bg-card);
  border-radius: 20px;
  box-shadow: var(--box-shadow-main);
  border: 1.5px solid var(--card-border);
  padding: 2.2rem 1.8rem 1.4rem 1.8rem;
  min-width: 220px;
  max-width: 320px;
  flex: 1 1 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.15s, background 0.15s, transform 0.12s;
  cursor: pointer;
  box-sizing: border-box;
  /* Evita overflow do card em grid apertado */
  word-break: break-word;
}

.admin-card:hover {
  box-shadow: 0 4px 32px var(--btn-bg-hover)19;
  background: var(--bg-input);
  transform: translateY(-4px) scale(1.03);
}

.admin-card-icon {
  font-size: 2.6rem;
  color: var(--btn-bg-hover);
  margin-bottom: 1.2rem;
  transition: color 0.13s;
}

.admin-card-title {
  font-size: 1.22rem;
  color: var(--text-accent);
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
}

.admin-card-desc {
  font-size: 1rem;
  color: var(--text-subtitle);
  text-align: center;
  margin-top: 0.2rem;
  word-break: break-word;
}

/* Responsividade: */
@media (max-width: 900px) {
  .admin-dashboard {
    padding: 0 0.8rem;
  }
  .admin-card-grid {
    gap: 1.2rem;
  }
  .admin-card {
    min-width: 170px;
    padding: 1.6rem 1rem 1.1rem 1rem;
    max-width: 95vw;
  }
}

@media (max-width: 600px) {
  .admin-dashboard {
    padding: 0 0.3rem;
  }
  .admin-card-grid {
    flex-direction: column;
    align-items: center;
    gap: 1.1rem;
  }
  .admin-card {
    width: 99%;
    min-width: unset;
    max-width: 420px;
    padding: 1.4rem 0.7rem 1rem 0.7rem;
  }
}

/* Segurança global - remova o overflow lateral do app se necessário */
html, body, #app, .app-layout {
  overflow-x: hidden;
}
</style>