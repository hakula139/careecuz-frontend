/**
 * Due to a type inference issue in Vue 3.2 with TypeScript, we have to define
 * the type of exposed instances manually here as a workaround.
 * See: https://github.com/vuejs/vue-next/issues/4397
 */

export interface ChannelAddDrawerExposed {
  openChannelAddDrawer: () => void;
}

export interface MessageAddDrawerExposed {
  openMessageAddDrawer: (replyTo?: string) => void;
}
