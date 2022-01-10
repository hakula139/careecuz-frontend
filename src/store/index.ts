import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { State, UserAuthResp } from '@/types';

export const key: InjectionKey<Store<State>> = Symbol('store');

export const store: Store<State> = createStore<State>({
  plugins: [createPersistedState()],

  state: {
    status: '',
    userId: '',
    userToken: '',
  },

  getters: {
    isLoggedIn: (state): boolean => Boolean(state.userToken),
  },

  mutations: {
    authLoading: (state): void => {
      state.status = 'loading';
    },

    authSuccess: (state, resp: UserAuthResp): void => {
      state.status = 'success';
      state.userId = resp.userId || '';
      state.userToken = resp.token || '';
    },

    authReset: (state) => {
      state.status = '';
      state.userId = '';
      state.userToken = '';
    },
  },
});

export const useStore = (): Store<State> => baseUseStore(key);
