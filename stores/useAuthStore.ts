import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

type User = {
    id: number;
    name: string;
    email: string;
    role: number;
    ip: string;
}

type Credentials = {
    email: string;
    password: string;
}

export const useAuthStore = defineStore('auth', () => {
        const user = ref<User | null>(null)

        async function logout() {
            await useApiFetch("/logout", { method: "POST" });
            user.value = null;
            navigateTo("/auth/login");
        }
    
        async function fetchUser() {
            const { data } = await useApiFetch("/api/user");
            user.value = data.value as User;

            return user
        }
        
        async function login(credentials: Credentials) {
            await useApiFetch("/sanctum/csrf-cookie");
            
            const login = await useApiFetch("/login", {
                method: "POST",
                body: credentials,
            });
            
            const user = await fetchUser();

            console.log(user)
    
            return login;
        }
    
        const isLoggedIn = computed(() => !!user.value)
        
        return { user, login, isLoggedIn, fetchUser, logout }
})