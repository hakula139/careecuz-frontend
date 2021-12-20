import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { BASE_URL } from '@/configs';

const RootLayout = () => import(/* webpackChunkName: "root-layout" */ '@/views/RootLayout.vue');
const ChannelPage = () => import(/* webpackChunkName: "channel" */ '@/views/ChannelPage.vue');
const ChannelList = () => import(/* webpackChunkName: "channel" */ '@/views/ChannelList.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: RootLayout,
    children: [
      {
        path: 'channels/:id',
        name: 'ChannelPage',
        component: ChannelPage,
      },
      {
        path: 'channels',
        name: 'ChannelList',
        component: ChannelList,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
});

export default router;
