import "vuefinder/dist/style.css";
import VueFinder from "@/node_modules/vuefinder/dist/vuefinder.js";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueFinder);
});
