import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface Medias {
    url: string;
    file_size: string;
    file_type: string;
    type: string;
    status: string;
}
export const useMediaStore = defineStore('media', () => {
    const medias = ref([]);
    const categories = ref([]);
    const media_types = ref([]);
    const media = ref<Medias | null>(null)
    const success = ref();
    const error = ref();

    async function getMedias() {
        try {
            const { data, error } = await useApiFetch("/api/images");
            const getMedias = JSON.parse(JSON.stringify(computed(() => data.value).value))
            medias.value = getMedias.medias;
            success.value = JSON.parse(JSON.stringify(computed(() => getMedias.success).value));
        } catch (error) {
            console.log(error);
        }
    }
    async function getMediaCategories() {
        try {
            const { data, error } = await useApiFetch("/api/images/categories");
            const getMediaCategories = JSON.parse(JSON.stringify(computed(() => data.value).value))
            categories.value = getMediaCategories.categories;
            success.value = JSON.parse(JSON.stringify(computed(() => getMediaCategories.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    async function getMediaTypes() {
        try {
            const { data, error } = await useApiFetch("/api/getEnums");
            const getMediaTypes = JSON.parse(JSON.stringify(computed(() => data.value).value))
            media_types.value = getMediaTypes.media_types;
            success.value = JSON.parse(JSON.stringify(computed(() => getMediaTypes.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { medias, getMedias, getMediaCategories, getMediaTypes, categories, media_types }
})