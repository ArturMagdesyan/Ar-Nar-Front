import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currency: 'rub',
    language: 'ru',
    isLoggedAdmin: false,
    adminUser: null,
  },
  mutations: {
    setLanguage(state, lang) {
      state.language = lang;
    },
    setCurrency(state, currency) {
      state.currency = currency;
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
    },
    setCurrency({commit}, currency) {
      commit('setCurrency', currency);
    }
  },
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
})
