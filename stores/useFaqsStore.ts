import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface Faqs {
    title: string;
    status: string;
}
export const useFaqsStore = defineStore('faqs', () => {
    const faqs = ref([]);
    const faq = ref<Faqs | null>(null)
    const success = ref();
    const error = ref();

    async function getFaqs() {
        try {
            const { data, error } = await useApiFetch("/api/faqs");
            const getFaqs = JSON.parse(JSON.stringify(computed(() => data.value).value))
            faqs.value = getFaqs.faqs;
            success.value = JSON.parse(JSON.stringify(computed(() => getFaqs.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { faqs, getFaqs }
})