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
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-main);
}

.base-content {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
  background: var(--bg-main);
}

.app-footer {
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-subtitle);
  padding: 1.1rem 0 0.7rem 0;
  background: none;
}

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
