import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface PriceCategories {
    name: string;
    size_id: number;
}
export const usePriceCategoriesStore = defineStore('priceCategories', () => {
    const price_categories = ref([]);
    const price_category = ref<PriceCategories | null>(null)
    const success = ref();
    const error = ref();

    async function getPriceCategories() {
        try {
            const { data, error } = await useApiFetch("/api/price-categories");
            const getPriceCategories = JSON.parse(JSON.stringify(computed(() => data.value).value))
            price_categories.value = getPriceCategories.price_categories.data;
            success.value = JSON.parse(JSON.stringify(computed(() => getPriceCategories.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { price_categories, getPriceCategories }
})