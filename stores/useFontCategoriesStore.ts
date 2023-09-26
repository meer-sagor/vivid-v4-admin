import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface FontCategories {
    name: string;
    description: string;
    status: string;
}
export const useFontCategoriesStore = defineStore('fontCategories', () => {
    const font_categories = ref([]);
    const font_category = ref<FontCategories | null>(null)
    const success = ref();
    const error = ref();

    async function getFontCategories() {
        try {
            const { data, error } = await useApiFetch("/api/font-categories");
            const getFontCategories = JSON.parse(JSON.stringify(computed(() => data.value).value))
            font_categories.value = getFontCategories.font_categories;
            success.value = JSON.parse(JSON.stringify(computed(() => getFontCategories.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { font_categories, getFontCategories }
})