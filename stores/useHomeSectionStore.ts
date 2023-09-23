import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface HomeSection {
    name: string;
    section_title: string;
    description: string | null;
    view_all_url: string | null;
    status: string;
}
export const useHomeSectionStore = defineStore('homeSections', () => {
    const home_sections = ref([]);
    const home_section = ref<HomeSection | null>(null)
    const success = ref();
    const error = ref();

    async function getHomeSections() {
        try {
            const { data, error } = await useApiFetch("/api/home-sections");
            const getHomeSections = JSON.parse(JSON.stringify(computed(() => data.value).value))
            home_sections.value = getHomeSections.home_sections;
            success.value = JSON.parse(JSON.stringify(computed(() => getHomeSections.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { home_sections, getHomeSections }
})