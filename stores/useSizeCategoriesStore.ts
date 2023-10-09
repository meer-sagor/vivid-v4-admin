import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface SizeCategories {
    category_name: string;
    status: number;
}
export const useSizeCategoriesStore = defineStore('size_categories', () => {
    const size_categories = ref([]);
    const size_category = ref<SizeCategories | null>(null)
    const success = ref();
    const error = ref();

    async function getSizeCategories() {
        try {
            const { data, error } = await useApiFetch("/api/size-categories");
            const getSizeCategories = JSON.parse(JSON.stringify(computed(() => data.value).value))
            size_categories.value = getSizeCategories.size_categories.data;
            success.value = JSON.parse(JSON.stringify(computed(() => getSizeCategories.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { size_categories, getSizeCategories }
})