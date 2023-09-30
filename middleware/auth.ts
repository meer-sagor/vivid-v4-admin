
import { useAuthStore } from "@/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore();

    
    console.log('test login: ', auth.isLoggedIn, 'store user', auth.user)

    // console.log('auth',auth.isLoggedIn)

    if (!auth.isLoggedIn) {
        return navigateTo("/auth/login", { replace: true })
    }
})
