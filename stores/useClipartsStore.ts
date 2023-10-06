import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface Cliparts {
    name: string;
    image_id: number;
}
export const useClipartsStore = defineStore('clioparts', () => {
    const cliparts = ref([]);
    const clipart = ref<Cliparts | null>(null)
    const success = ref();
    const error = ref();

    async function getCliparts() {
        try {
            const { data, error } = await useApiFetch("/api/price-categories");
            const getCliparts = JSON.parse(JSON.stringify(computed(() => data.value).value))
            cliparts.value = getCliparts.cliparts.data;
            success.value = JSON.parse(JSON.stringify(computed(() => getCliparts.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { cliparts, getCliparts }
})