import { useAuthStore } from "@/stores/useAuthStore"
import JwtService from "~/config/JwtService";

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore();

    const token = process.client ? JwtService.getToken() : null;

    if (token){
        if (!auth.isLoggedIn) {
            await auth.fetchUser()
        }
    }
})
