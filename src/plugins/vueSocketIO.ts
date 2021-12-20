import { App, Plugin } from 'vue';
import { io, ManagerOptions, SocketOptions } from 'socket.io-client';

export interface SocketIOPluginOptions {
  uri: string;
  opts?: Partial<ManagerOptions & SocketOptions>;
}

const VueSocketIO: Plugin = {
  install: (app: App, { uri, opts }: SocketIOPluginOptions): void => {
    const socket = io(uri, opts);
    app.config.globalProperties.socket = socket;
    app.provide('socket', socket);
  },
};

export default VueSocketIO;
