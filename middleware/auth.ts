
import { useAuthStore } from "@/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore();

    console.log('')
    if (!auth.isLoggedIn) {
        return navigateTo("/auth/login", { replace: true })
    }
})
