import { useAuthStore } from "@/stores/useAuthStore"

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore();

    console.log('loadUser', auth.isLoggedIn)

    if (!auth.isLoggedIn) {
        await auth.fetchUser()
    }
})
