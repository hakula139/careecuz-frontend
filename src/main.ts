import { createApp } from 'vue';

import { PROD, VITE_API_URL } from '@/configs';
import App from '@/App.vue';
import router from '@/router';
import { store, key } from '@/store';
import io, { SocketIOPluginOptions } from '@/plugins/vueSocketIO';
import '@/assets/index.css';

const app = createApp(App);

app
  .use(router)
  .use(store, key)
  .use(io, {
    uri: VITE_API_URL,
    opts: {
      reconnection: true,
      secure: PROD,
    },
  } as SocketIOPluginOptions);

app.mount('#app');
