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
    token: '',
  },

  getters: {
    isLoggedIn: (state): boolean => Boolean(state.token),
  },

  mutations: {
    authLoading: (state): void => {
      state.status = 'loading';
    },

    authSuccess: (state, { userId, token }: UserAuthResp): void => {
      state.status = 'success';
      state.userId = userId || '';
      state.token = token || '';
    },

    authReset: (state) => {
      state.status = '';
      state.userId = '';
      state.token = '';
    },
  },
});

export const useStore = (): Store<State> => baseUseStore(key);
