import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import Vuelidate from "vuelidate";

import router from "./router";
import store from "./store";

Vue.use(Vuelidate)

axios.defaults.baseURL = "https://vue-axios-aut.firebaseio.com";
// axios.defaults.headers.common["Authorization"] = "something";

axios.interceptors.request.use(config => {
  console.log("request interceptor", config);
  return config;
});

axios.interceptors.response.use(res => {
  console.log("response interceptor", res);
  return res;
});

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
