
import { useAuthStore } from "@/stores/useAuthStore";
// export default defineNuxtRouteMiddleware((to, from) => {
//   console.log(to.name, from.name, auth.isLoggedIn)

//   // if (to.name === "auth-Login" && from.name === "auth-Login") {
//   //   return navigateTo('/')
//   // }

//   if(auth.isLoggedIn) {
//     console.log('%c Authenticated! ', 'background: #222; color: #bada55')

//     if (to.name === "auth-Login") {
//       return navigateTo('/')
//     }
//   } else {
//     console.log('%c Not Authenticated! ', 'background: #222; color: #ad1010')
//     if (to.name !== "auth-Login") {
//       return navigateTo('/auth/Login')
//     }
//   }
// })

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore();

    // if (!auth.isLoggedIn) {
    //     return navigateTo("/auth/login", { replace: true })
    // }

})