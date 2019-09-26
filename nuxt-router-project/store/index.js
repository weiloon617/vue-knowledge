import Vuex from "vuex";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost;
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return context.app.$axios
          .$get("/posts.json")
          .then(data => {
            const postsArray = [];
            for (const key in data) {
              postsArray.push({ ...data[key], id: key });
            }
            commit("setPosts", postsArray);
          })
          .catch(error => context.error(error));
      },
      setPosts({ commit }, posts) {
        commit("setPosts", posts);
      },
      addPost({ commit, state }, post) {
        return this.$axios
          .$post("/posts.json?auth=" + state.token, post)
          .then(data => {
            commit("addPost", { ...post, id: data.name });
          })
          .catch(error => console.log(error));
      },
      editPost({ commit, state }, editedPost) {
        return this.$axios
          .$put(
            "/posts/" + editedPost.id + ".json?auth=" + state.token,
            editedPost
          )
          .then(data => {
            commit("editPost", editedPost);
          })
          .catch(error => console.log(error));
      },
      authenticateUser({ commit, dispatch }, authData) {
        let authUrl =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
          process.env.fbAPIKey;

        if (!authData.isLogin) {
          authUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            process.env.fbAPIKey;
        }

        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(result => {
            // set token in store
            commit("setToken", result.idToken);

            // set token, expirationDate to local storage
            localStorage.setItem("token", result.idToken);
            localStorage.setItem(
              "expirationDate",
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
            );

            // set token, expirationDate to cookie
            Cookie.set("token", result.idToken);
            Cookie.set(
              "expirationDate",
              new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
            );

            return this.$axios.$post("http://localhost:3000/api/track-data", {
              data: "Authenticated"
            });
          })
          .catch(error => console.log(error));
      },
      initAuth({ commit, dispatch }, request) {
        let token, expirationDate;

        if (request) {
          if (!request.headers.cookie) {
            const tokenCookie = request.headers.cookie
              .split(";")
              .find(c => c.trim().startsWith("token="));

            if (!tokenCookie) {
              return;
            }

            token = tokenCookie.split("=")[1];
            expirationDate = request.headers.cookie
              .split(";")
              .find(c => c.trim().startsWith("expirationDate="))
              .split("=")[1];
          }
        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("expirationDate");

          if (new Date() > expirationDate || !token) {
            commit("clearToken");
            return;
          }
        }

        commit("setToken", token);
      },
      logout({ commit }) {
        // clear token in store
        commit("clearToken");

        // remove token, expirationDate from Cookie
        Cookie.remove("token");
        Cookie.remove("expirationDate");

        // remove token, expirationDate from local storage
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("expirationDate");
        }
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token !== null;
      }
    }
  });
};

export default createStore;
