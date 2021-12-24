import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { State, UserLoginResp, UserRegisterResp } from '@/types';

export const key: InjectionKey<Store<State>> = Symbol('key');

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

    authSuccess: (state, resp: UserLoginResp | UserRegisterResp): void => {
      state.status = 'success';
      state.userId = resp.id;
      state.userToken = resp.token;
    },

    authReset: (state) => {
      state.status = '';
      state.userId = '';
      state.userToken = '';
    },
  },
});

export const useStore = (): Store<State> => baseUseStore(key);
