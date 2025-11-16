<script setup lang="ts">
import { menuItems } from '@/configs/menuItems'
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="main-menu">
    <ul>
      <li v-for="item in menuItems" :key="item.title">
        <RouterLink :to="item.path" class="menu-link">
          <i :class="['fas', item.icon]"></i>
          <span>{{ item.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
