import { defineStore } from "pinia";
import { useApiFetch } from "@/composables/useApiFetch";
import JwtService from "@/config/JwtService";

type User = {
  id: number;
  name: string;
  email: string;
  role: number;
  ip: string;
};

type Credentials = {
  email: string;
  password: string;
};

export const useAuthStore = defineStore("auth", () => {
  const loginInUser = ref({});
  let user = ref<User | null>(null);

  const setToken = (access_token: string, userData: any) => {
    JwtService.saveToken(access_token);
    JwtService.saveUser(JSON.stringify(userData));
  };

  const removeToken = () => {
    JwtService.destroyToken();
    JwtService.destroyUser();
  };

  async function fetchUser() {
    if (process.client) {
      const { data, error } = await useApiFetch("/api/user");
      user.value = data.value as User;
    }
  }

  async function login(credentials: Credentials) {
    const login = await useApiFetch("/login", {
      method: "POST",
      body: credentials,
    });

    return login;
  }

  async function logout() {
    await useApiFetch("/api/logout", { method: "POST" });
    JwtService.destroyToken();
    JwtService.destroyUser();
    // navigateTo("/auth/login", { replace: true }); // Somehow it doesn't work. Please check.
    location.replace("/auth/login");
  }

  const isLoggedIn = computed(() => !!user.value);

  return {
    login,
    setToken,
    removeToken,
    user,
    isLoggedIn,
    fetchUser,
    loginInUser,
    logout,
  };
});
