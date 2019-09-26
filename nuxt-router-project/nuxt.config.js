const bodyParser = require("body-parser");
const axios = require("axios");

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["~assets/styles/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~plugins/core-components.js", "~plugins/date-filter.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios"],
  axios: {
    baseURL: process.env.BASE_URL || "https://nuxt-blog-4801f.firebaseio.com",
    credential: false
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  /*
   ** Process Environment
   */
  env: {
    baseUrl: process.env.BASE_URL || "https://nuxt-blog-4801f.firebaseio.com",
    fbAPIKey: "AIzaSyDVgFAJ0kBrZp348Cf7ek0swo9UDd150dk"
  },
  /*
   ** Change page animation
   */
  transition: {
    name: "fade",
    mode: "out-in"
  },
  /*
   ** Server middleware
   */
  serverMiddleware: [bodyParser.json(), "~/api"],
  /*
   ** Configuration for production build files
   */
  generate: {
    routes: function() {
      return axios
        .get("https://nuxt-blog-4801f.firebaseio.com/posts.json")
        .then(res => {
          const routes = [];
          for (const key in res.data) {
            routes.push({
              route: "/posts/" + key,
              payload: { postData: res.data[key] }
            });
          }
          return routes;
        });
    }
  }
};
