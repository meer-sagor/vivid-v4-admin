import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface Role {
    name: string;
}
export const useRolesStore = defineStore('roles', () => {
    const roles = ref<Role[] | null>(null);
    const role = ref<Role | null>(null)

    async function getRoles() {
        const { data } = await useApiFetch("/api/roles", {
            method: "GET",
        })
        // roles.value = data.value.value.roles as Role[]
        console.log(data.value.roles)
    }

    return { roles, getRoles }
})