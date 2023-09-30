import { useAuthStore } from "@/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
    setTimeout(() => {
        if (!["auth-Login"].includes(to.name as string)) {
            const auth = useAuthStore();
        
            console.log("auth", auth.isLoggedIn);
        
            if (!auth.isLoggedIn) {
              return navigateTo("/auth/login", { replace: true });
            }
          }
    }, 1000)
});
