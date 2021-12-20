import { createApp } from 'vue';

import { VITE_API_URL } from '@/configs';
import App from '@/App.vue';
import router from '@/router';
import io, { SocketIOPluginOptions } from '@/plugins/vueSocketIO';
import '@/assets/css/index.css';

const app = createApp(App);

app.use(router);

app.use(io, {
  uri: VITE_API_URL as string,
  opts: {
    reconnection: true,
  },
} as SocketIOPluginOptions);

app.mount('#app');
