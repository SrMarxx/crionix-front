<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import NavMenu from '@/components/NavMenu.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <div class="base-content">
      <NavMenu />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
    <footer class="app-footer">
      <p>&copy; 2023 SmartTech. All rights reserved.</p>
    </footer>
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
}
</style>
