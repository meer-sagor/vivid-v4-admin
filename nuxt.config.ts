// https://nuxt.com/docs/api/configuration/nuxt-config
import { environment, baseURL, apiURL } from "./config/environment";

export default defineNuxtConfig({
  devtools: { enabled: environment === "dev" ? true : false },
  app: {
    head: {
      title: "Vividcustoms - Admin Panel",
      link: [
        {
          id: "theme-css",
          rel: "stylesheet",
          type: "text/css",
          href: "/themes/lara-light-blue/theme.css",
        },
        {
          id: "primeflex",
          rel: "stylesheet",
          type: "text/css",
          href: "https://unpkg.com/primeflex@3.3.0/primeflex.css",
        },
      ],
      // script: [
      //     { async: false, src: 'https://unpkg.com/primeflex@^3/primeflex.css', } ]
    },
  },
  build: {
    transpile: ["primevue"],
  },
  sourcemap: {
    server: false,
    client: false,
  },
  nitro: {
    baseURL: baseURL,
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },
  modules: ["@pinia/nuxt"],
  devServer: {
    port: 3002,
  },
  css: [
    "primeicons/primeicons.css",
    /*'primeflex/primeflex.scss',*/ "primevue/resources/primevue.min.css",
    "@/assets/styles.scss",
  ],
});
