<script setup lang="ts">
import { menuItems } from '@/configs/menuItems'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
function goTo(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="fnix-nav-menu">
    <ul>
      <li v-for="item in menuItems" :key="item.title">
        <button
          class="nav-menu-link"
          :class="{ 'is-active': route.path === item.path }"
          @click="goTo(item.path)"
        >
          <i :class="['fas', item.icon]"></i>
          <span>{{ item.title }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.fnix-nav-menu {
  width: 100%;
  max-width: 1280px; /* valor de exemplo, ajuste conforme breakpoints do layout */
  margin: 18px auto 20px auto;
  display: flex;
  justify-content: center;
  z-index: 30;
  padding-inline: 2vw; /* espaçamento responsivo entre menu e borda da tela */
}

.fnix-nav-menu ul {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 14px;
  background: var(--bg-card);
  border-radius: 18px;
  box-shadow: var(--box-shadow-main);
  padding: 0.6rem 2.2rem; /* aumente/sintonize esse padding também */
  border: 1px solid var(--card-border);
  margin: 0;
  list-style: none;
  align-items: center;
  justify-content: space-around;
}
.nav-menu-link {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.13rem;
  color: var(--text-main);
  font-family: 'Inter', 'SF Pro', 'Roboto', sans-serif;
  padding: 0.69em 1em;
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition:
    background 0.18s,
    color 0.14s;
}
.nav-menu-link i {
  font-size: 1.17rem;
  color: var(--icon-primary);
}

.nav-menu-link:hover,
.nav-menu-link.router-link-active {
  background: var(--bg-input);
  color: var(--text-accent);
}
.nav-menu-link.router-link-active i,
.nav-menu-link:hover i {
  color: var(--btn-bg-hover);
}

.nav-menu-link.is-active {
  background: var(--btn-bg);
  color: var(--btn-text);
  box-shadow: 0 2px 14px var(--btn-bg-hover) 19;
  border-radius: 13px;
  font-weight: 700;
}

.nav-menu-link.is-active i {
  color: var(--btn-text);
}

@media (max-width: 1300px) {
  .fnix-nav-menu {
    max-width: 98vw;
    padding-inline: 1vw;
  }
  .fnix-nav-menu ul {
    padding: 0.6rem 0.8rem;
  }
}

@media (max-width: 900px) {
  .fnix-nav-menu {
    display: none !important;
  }
}
</style>
