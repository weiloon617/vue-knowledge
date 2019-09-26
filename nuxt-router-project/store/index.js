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
        // 获取编辑的Post Index
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
      /**
       * 一开始进来页面，只会调用一次
       * @param commit
       * @param context
       * @returns {Promise<any>}
       */
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
      /**
       * 设置 Posts
       * @param commit
       * @param posts
       */
      setPosts({ commit }, posts) {
        commit("setPosts", posts);
      },
      /**
       * 添加 Post
       * @param commit
       * @param state
       * @param post
       * @returns {Promise<any | void>}
       */
      addPost({ commit, state }, post) {
        return this.$axios
          .$post("/posts.json?auth=" + state.token, post)
          .then(data => {
            commit("addPost", { ...post, id: data.name });
          })
          .catch(error => console.log(error));
      },
      /**
       * 编辑 Post
       * @param commit
       * @param state
       * @param editedPost
       * @returns {Promise<any | void>}
       */
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
      /**
       * 用户登录或注册
       * @param commit
       * @param dispatch
       * @param authData
       * @returns {Promise<any | void>}
       */
      authenticateUser({ commit, dispatch }, authData) {
        const { email, password, isLogin } = authData;
        let authUrl =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
          process.env.fbAPIKey;

        if (!isLogin) {
          authUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            process.env.fbAPIKey;
        }

        return this.$axios
          .$post(authUrl, {
            email,
            password,
            returnSecureToken: true
          })
          .then(result => {
            const { idToken, expiresIn } = result;
            const expirationDate =
              new Date().getTime() + Number.parseInt(expiresIn) * 1000;

            // 储存token -> store
            commit("setToken", result.idToken);

            // 储存 token, expirationDate -> local storage
            localStorage.setItem("token", idToken);
            localStorage.setItem("expirationDate", expirationDate);

            // 储存 token, expirationDate -> cookie
            Cookie.set("token", idToken);
            Cookie.set("expirationDate", expirationDate);

            // serverMiddleware 例子
            return this.$axios.$post("http://localhost:3000/api/track-data", {
              data: "Authenticated"
            });
          })
          .catch(error => console.log(error));
      },
      /**
       * 检查是否在登录状态
       * @param commit
       * @param dispatch
       * @param request
       */
      initAuth({ commit, dispatch }, request) {
        let token, expirationDate;

        // 检测request是否从server传来的
        if (request) {
          if (!request.headers.cookie) {
            const tokenCookie = request.headers.cookie
              .split(";")
              .find(c => c.trim().startsWith("token="));

            // 如果cookie里没有token，直接clearToken登出
            if (!tokenCookie) {
              commit("clearToken");
              return;
            }

            token = tokenCookie.split("=")[1];
            expirationDate = request.headers.cookie
              .split(";")
              .find(c => c.trim().startsWith("expirationDate="))
              .split("=")[1];
          }
        }
        // 检测是不是在client side
        else if (process.client) {
          // 从local storage获取token, expirationDate
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("expirationDate");

          // 如果登录超时或者没有token, 直接clearToken登出
          if (new Date() > expirationDate || !token) {
            commit("clearToken");
            return;
          }
        }

        commit("setToken", token);
      },
      /**
       * 用户登出
       * @param commit
       */
      logout({ commit }) {
        // 清除 token -> store
        commit("clearToken");

        // 清除 token, expirationDate -> Cookie
        Cookie.remove("token");
        Cookie.remove("expirationDate");

        // 清除 token, expirationDate -> local storage
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
