import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('../layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: '/maintenances',
          name: 'maintenances',
          component: () => import('../views/MaintenancesView.vue'),
        },
        {
          path: '/equipments',
          name: 'equipments',
          component: () => import('../views/EquipamentsView.vue'),
        },
        {
          path: '/reports',
          name: 'reports',
          component: () => import('../views/ReportsView.vue'),
        },
        {
          path: '/administration',
          name: 'administration',
          component: () => import('../layouts/AdminLayout.vue'),
          meta: {requiredPermission: 'CRIAR'},
          children: [
            {
              path: '/administration',
              name: 'administrationHome',
              component: () => import('../views/administracao/AdministrationView.vue'),
            },
            {
              path: '/administration/users',
              name: 'usersManagement',
              component: () => import('../views/administracao/UsersManagementView.vue'),
            },
            {
              path: '/administration/machines',
              name: 'machinesManagement',
              component: () => import('../views/administracao/MachinesManagementView.vue'),
            },
            {
              path: '/administration/sensors',
              name: 'sensorsManagement',
              component: () => import('../views/administracao/SensorsManagementView.vue'),
            },
          ],
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredPermission = to.meta.requiredPermission as string | undefined

  if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
    return { name: 'dashboard' }
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
  return true
})

export default router
