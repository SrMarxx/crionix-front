export const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'fa-arrow-trend-up',
    requiredPermission: 'VISUALIZAR',
  },
  {
    title: 'Manutenções',
    path: '/maintenances',
    icon: 'fa-wrench',
    requiredPermission: 'VISUALIZAR',
  },
  {
    title: 'Equipamentos',
    path: '/equipments',
    icon: 'fa-snowflake',
    requiredPermission: 'VISUALIZAR',
  },
  {
    title: 'Relatórios',
    path: '/reports',
    icon: 'fa-file-text',
    requiredPermission: 'VISUALIZAR',
  },
  {
    title: 'Administração',
    path: '/administration',
    icon: 'fa-cogs',
    requiredPermission: 'CRIAR',
  }
]
