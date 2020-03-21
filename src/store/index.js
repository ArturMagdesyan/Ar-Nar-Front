import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedAdmin: false,
    language: 'hy',
    adminUser: null,
  },
  mutations: {
    setLanguage(state, lang) {
      state.language = lang;
    },
    login(state, adminUser) {
      state.adminUser = adminUser;
    },
    logout(state) {
      state.adminUser = null;
    }
  },
  actions: {
    setLanguage({ commit }, lang) {
      commit('setLanguage', lang);
    },
    login({commit, state}, adminUser) {
      state.isLoggedAdmin = true;
      commit('login', adminUser);
    },
    logout({commit, state}) {
      state.isLoggedAdmin = false;
      commit('logout');
    }
  },
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
})
