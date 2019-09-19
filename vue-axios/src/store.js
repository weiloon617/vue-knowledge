import Vue from "vue";
import Vuex from "vuex";

import axios from "./axios-auth";
import globalAxios from "axios";

import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    storeUser(state, user) {
      state.user = user;
    },
    clearAuthData(state) {
      state.idToken = null;
      state.userId = null;
    }
  },
  actions: {
    signup({ commit, dispatch }, authData) {
      axios
        .post("/accounts:signUp?key=AIzaSyCUeiJE0PviwU2XLzZ2C-qD0_SnJnNh5ns", {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
        .then(res => {
          console.log(res);
          const { data } = res;
          commit("authUser", {
            token: data.idToken,
            userId: data.localId
          });
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + data.expiresIn * 1000
          );
          localStorage.setItem("token", data.idToken);
          localStorage.setItem("userId", data.localId);
          localStorage.setItem("expirationDate", expirationDate);
          dispatch("storeUser", authData);
          dispatch("setLogoutTimer", data.expiresIn);
          router.replace("/dashboard");
        })
        .catch(error => console.log(error));
    },
    login({ commit, dispatch }, authData) {
      axios
        .post(
          "/accounts:signInWithPassword?key=AIzaSyCUeiJE0PviwU2XLzZ2C-qD0_SnJnNh5ns",
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          }
        )
        .then(res => {
          console.log(res);
          const { data } = res;
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + data.expiresIn * 1000
          );
          localStorage.setItem("token", data.idToken);
          localStorage.setItem("userId", data.localId);
          localStorage.setItem("expirationDate", expirationDate);
          commit("authUser", {
            token: data.idToken,
            userId: data.localId
          });
          dispatch("setLogoutTimer", data.expiresIn);
          router.replace("/dashboard");
        })
        .catch(error => console.log(error));
    },
    tryAutoLogin({ commit }) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const expirationDate = localStorage.getItem("expirationDate");
      const now = new Date();
      if (now >= expirationDate) {
        return;
      }
      const userId = localStorage.getItem("userId");
      commit("authUser", { token, userId });
    },
    logout({ commit }) {
      commit("clearAuthData");
      localStorage.removeItem("token");
      localStorage.removeItem("expirationDate");
      localStorage.removeItem("userId");
      router.replace("/signin");
    },
    setLogoutTimer({ commit, dispatch }, expirationTime) {
      setTimeout(() => dispatch("logout"), expirationTime * 1000);
    },
    storeUser({ commit, state }, userData) {
      if (!state.idToken) {
        return;
      }
      globalAxios
        .post("/user.json" + "?auth=" + state.idToken, userData)
        .then(res => console.log(res))
        .catch(error => console.log(error));
    },
    fetchUser({ commit, state }) {
      if (!state.idToken) {
        return;
      }
      globalAxios
        .get("/user.json" + "?auth=" + state.idToken)
        .then(res => {
          console.log(res);
          const data = res.data;
          const users = [];
          for (let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
          commit("storeUser", users[0]);
        })
        .catch(error => console.log(error));
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.idToken !== null;
    }
  }
});
