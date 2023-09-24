import { defineStore } from "pinia"
import { useApiFetch } from "@/composables/useApiFetch";

interface PromoCode {
    name: string;
    description: string;
    discount_type: string;
    discount_amount: string;
    min_spend: string | null;
    max_spend: string | null;
    per_coupon_limit: string | null;
    remaining_coupon: string | null;
    per_user_limit: string | null;
    expiry_date: string;
    status: string;
}
export const usePromoCodeStore = defineStore('promoCode', () => {
    const promo_codes = ref([]);
    const promo_code = ref<PromoCode | null>(null)
    const success = ref();
    const error = ref();

    async function getPromoCodes() {
        try {
            const { data, error } = await useApiFetch("/api/promo-codes");
            const getPromoCodes = JSON.parse(JSON.stringify(computed(() => data.value).value))
            promo_codes.value = getPromoCodes.home_sections;
            success.value = JSON.parse(JSON.stringify(computed(() => getPromoCodes.success).value));
        } catch (error) {
            console.log(error);
        }
    }

    return { promo_codes, getPromoCodes }
})