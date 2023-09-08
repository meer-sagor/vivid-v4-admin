import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface Role {
    name: string;
}
export const useRolesStore = defineStore('roles', () => {
    const roles = ref<Role[] | null>(null);
    const role = ref<Role | null>(null)

    async function getRoles() {
        try {
            const { data } = await useApiFetch("/api/roles");
            roles.value = data.value as Role[];
        } catch (error) {
            console.log(error);
        }
        // const { data } = await useApiFetch("/api/roles"
        // // {
        // //     method: "GET",
        // // }
        // )
        // console.log(data)
        // roles.value = data.value as Role[]
        
    }

    return { roles, getRoles }
})