import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    tsconfigPaths({ loose: true }),
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          resolveIcons: true,
        }),
      ],
    }),
  ],
});
