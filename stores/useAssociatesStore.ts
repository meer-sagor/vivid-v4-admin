import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

export const useAssociatesStore = defineStore('associates', () => {
    const associates = ref([]);
    const success = ref();
    const error = ref();

    async function getAssociates() {
        try {
            const { data, error } = await useApiFetch("/api/associates");
            const getAssociates = JSON.parse(JSON.stringify(computed(() => data.value).value))
            console.log(getAssociates)
            associates.value = getAssociates.users.data;
            success.value = JSON.parse(JSON.stringify(computed(() => getAssociates.success).value));
            error.value = error.value;
        } catch (error) {
            console.log(error);
        }

        console.log(associates)
    }

    return { associates, success, error, getAssociates }
})