import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const RootLayout = () => import(/* webpackChunkName: "root-layout" */ '@/views/RootLayout.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: RootLayout,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
