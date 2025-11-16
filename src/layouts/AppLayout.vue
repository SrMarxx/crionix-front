<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <AppHeader />
    </header>
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="app-footer">
      <p>&copy; 2024 CrioNix. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-main);
}
.main-content {
  flex-grow: 1;
  padding: 2.5rem;
  overflow-y: auto;
}
</style>
