import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { BASE_URL } from '@/configs';
import { store } from '@/store';

const RootLayout = () => import(/* webpackChunkName: "root-layout" */ '@/views/RootLayout.vue');
const ChannelPage = () => import(/* webpackChunkName: "channel-page" */ '@/views/ChannelPage.vue');
const ChannelList = () => import(/* webpackChunkName: "channel-list" */ '@/views/ChannelList.vue');
const MessageReplyPage = () => import(/* webpackChunkName: "message-reply-page" */ '@/views/MessageReplyPage.vue');
const NotificationList = () => import(/* webpackChunkName: "notification-list" */ '@/views/NotificationList.vue');
const UserPage = () => import(/* webpackChunkName: "user-page" */ '@/views/UserPage.vue');
const UserLoginPage = () => import(/* webpackChunkName: "user-login-page" */ '@/views/UserLoginPage.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: RootLayout,
    redirect: {
      name: 'ChannelList',
    },
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
        path: 'notifications',
        name: 'NotificationList',
        component: NotificationList,
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
      {
        path: 'login',
        name: 'UserLoginPage',
        component: UserLoginPage,
        beforeEnter: (_to, _from) => {
          if (store.getters.isLoggedIn) {
            console.log('user already logged in, redirecting...');
            return { name: 'ChannelPage' };
          }
          return true;
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
});

router.beforeEach((to, _from) => {
  if (to.name !== 'UserLoginPage' && !store.getters.isLoggedIn) {
    console.log('user not logged in, redirecting...');
    return { name: 'UserLoginPage' };
  }
  return true;
});

export default router;
