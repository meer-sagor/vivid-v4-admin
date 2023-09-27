import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface Fonts {
    name: string;
    size: number;
    file: string;
    font_category_id: number;
    status: string;
}
export const useFontsStore = defineStore('fonts', () => {
    const fonts = ref([]);
    const font = ref<Fonts | null>(null)
    const success = ref();
    const error = ref();

    async function getFonts() {
        try {
            const { data, error } = await useApiFetch("/api/fonts");
            const getFonts = JSON.parse(JSON.stringify(computed(() => data.value).value))
            fonts.value = getFonts.fonts;
            success.value = JSON.parse(JSON.stringify(computed(() => getFonts.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { fonts, getFonts }
})