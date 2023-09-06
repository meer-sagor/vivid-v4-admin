// https://nuxt.com/docs/api/configuration/nuxt-config
import { environment } from "./config/environment"

export default defineNuxtConfig({
  devtools: { enabled: environment == 'dev' ? true : false },
  app: {
    head: {
        title: 'Vividcustoms - Admin Panel',
        link: [
            {
                id: 'theme-css',
                rel: 'stylesheet',
                type: 'text/css',
                href: '/themes/lara-light-blue/theme.css'
            }
        ]
    }
  },
  build: {
    transpile: ['primevue']
  },
  modules: [
    '@pinia/nuxt',
  ],
  devServer: {
    port: 3002,
  },
  css: ['primeicons/primeicons.css', 'primeflex/primeflex.scss', 'primevue/resources/primevue.min.css', '@/assets/styles.scss']
})
