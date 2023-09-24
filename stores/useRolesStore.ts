import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface Role {
    name: string;
}
export const useRolesStore = defineStore('roles', () => {
    const roles = ref([]);
    const role = ref<Role | null>(null)
    const success = ref();
    const error = ref();

    async function getRoles() {
        try {
            const { data, error } = await useApiFetch("/api/roles");
            const getRoles = JSON.parse(JSON.stringify(computed(() => data.value).value))
            roles.value = getRoles.roles;
            success.value = JSON.parse(JSON.stringify(computed(() => getRoles.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { roles, getRoles }
})