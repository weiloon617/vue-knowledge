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
    /**
     * 组册账号
     * @param commit
     * @param dispatch
     * @param authData
     */
    signup({ commit, dispatch }, authData) {
      axios
        .post("/accounts:signUp?key=AIzaSyCUeiJE0PviwU2XLzZ2C-qD0_SnJnNh5ns", {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
        .then(res => {
          const { data } = res;
          const { idToken, localId, expiresIn } = data;

          commit("authUser", {
            token: idToken,
            userId: localId
          });

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);

          localStorage.setItem("token", idToken);
          localStorage.setItem("userId", localId);
          localStorage.setItem("expirationDate", expirationDate);

          dispatch("storeUser", authData);
          dispatch("setLogoutTimer", expiresIn);

          router.replace("/dashboard");
        })
        .catch(error => console.log(error));
    },
    /**
     * 用户登录
     * @param commit
     * @param dispatch
     * @param authData
     */
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
          const { data } = res;
          const { idToken, localId, expiresIn } = data;

          commit("authUser", {
            token: idToken,
            userId: localId
          });

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);

          localStorage.setItem("token", idToken);
          localStorage.setItem("userId", localId);
          localStorage.setItem("expirationDate", expirationDate);

          dispatch("setLogoutTimer", expiresIn);

          router.replace("/dashboard");
        })
        .catch(error => console.log(error));
    },
    /**
     * 查看是否在登录状态
     * @param commit
     */
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
    /**
     * 帐号登出
     * @param commit
     */
    logout({ commit }) {
      commit("clearAuthData");

      localStorage.removeItem("token");
      localStorage.removeItem("expirationDate");
      localStorage.removeItem("userId");

      router.replace("/signin");
    },
    /**
     * 设置登出时间
     * @param commit
     * @param dispatch
     * @param expirationTime
     */
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
    /**
     * 获取用户资讯
     * @param commit
     * @param state
     */
    fetchUser({ commit, state }) {
      if (!state.idToken) {
        return;
      }
      globalAxios
        .get("/user.json" + "?auth=" + state.idToken)
        .then(res => {
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
