<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <div class="base-content">
      <main class="main-content">
        <section class="admin-dashboard">
            <h2 class="admin-title">Administração</h2>
            <RouterView />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>

.admin-dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

.admin-title {
  text-align: center;
  font-size: 2rem;
  color: var(--text-accent);
  margin: 1.5rem 0 2.2rem 0;
  font-weight: 700;
}

@media (max-width: 900px) {
  .admin-dashboard {
    padding: 0 0.8rem;
  }
}

@media (max-width: 600px) {
  .base-content {
    flex-direction: column;
  }
  .main-content {
    padding: 0.6rem 0.2rem;
  }
  .main-menu {
    padding: 1rem 0.3rem 0.85rem 0.3rem !important;
  }
  .admin-dashboard {
    padding: 0 0.3rem;
  }
}
</style>
