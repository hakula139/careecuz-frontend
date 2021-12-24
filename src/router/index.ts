import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { BASE_URL } from '@/configs';

const RootLayout = () => import(/* webpackChunkName: "root-layout" */ '@/views/RootLayout.vue');
const ChannelPage = () => import(/* webpackChunkName: "channel-page" */ '@/views/ChannelPage.vue');
const ChannelList = () => import(/* webpackChunkName: "channel-list" */ '@/views/ChannelList.vue');
const MessageReplyPage = () => import(/* webpackChunkName: "message-reply-page" */ '@/views/MessageReplyPage.vue');
const UserPage = () => import(/* webpackChunkName: "user-page" */ '@/views/UserPage.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: RootLayout,
    children: [
      {
        path: 'channels/:channelId',
        name: 'ChannelPage',
        component: ChannelPage,
        children: [
          {
            path: 'messages/:messageId',
            name: 'MessageReplyPage',
            component: MessageReplyPage,
          },
        ],
      },
      {
        path: 'channels',
        name: 'ChannelList',
        component: ChannelList,
      },
      {
        path: 'user/:userId',
        name: 'UserPage',
        component: UserPage,
      },
      {
        path: 'profile',
        name: 'MyProfile',
        component: UserPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
});

export default router;
