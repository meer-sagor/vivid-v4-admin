<template>
  <div class="card">
    <h5>Add Promo code</h5>
    <template v-if="fetching">
      <Form
        id="add_promo_code_form"
        @submit="onSubmit"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <div class="flex flex-column gap-2 mb-1">
          <label for="name">Name</label>
          <Field
            v-model="promo_code.name"
            id="name"
            name="name"
            :class="{ 'p-invalid': errors.name }"
            class="p-inputtext p-component"
            aria-describedby="promo-code-name-error"
            placeholder="Enter name"
          />
          <small class="p-error" id="promo-code-name-error">{{
            errors.name || "&nbsp;"
          }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="description">Description</label>
          <Field
            type="textarea"
            v-model="promo_code.description"
            id="description"
            name="description"
            :class="{ 'p-invalid': errors.description }"
            class="p-inputtext p-component"
            aria-describedby="promo-code-description-error"
            placeholder="Enter description"
          />
          <small class="p-error" id="promo-code-description-error">{{
            errors.description || "&nbsp;"
          }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="discount_type">Discount Type</label>
          <Field name="discount_type" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              v-model="promo_code.discount_type"
              :options="discount_type_enums"
              optionLabel="name"
              optionValue="name"
              placeholder="Select a discount type"
              display="chip"
              :class="{ 'p-invalid': errors.discount_type }"
              aria-describedby="promo-code-discount-type-error"
            ></Dropdown>
          </Field>
          <small class="p-error" id="promo-code-discount-type-error">{{
            errors.discount_type || "&nbsp;"
          }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="discount_amount">Discount Amount</label>
          <Field
            v-model="promo_code.discount_amount"
            id="discount_amount"
            name="discount_amount"
            :class="{ 'p-invalid': errors.discount_amount }"
            class="p-inputtext p-component"
            aria-describedby="promo-code-discount-amount-error"
            placeholder="Discount amount"
          />
          <small class="p-error" id="promo-code-discount-amount-error">{{
            errors.discount_amount || "&nbsp;"
          }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="min_spend">Min Spend</label>
          <Field
            v-model="promo_code.min_spend"
            id="min_spend"
            name="min_spend"
            :class="{ 'p-invalid': errors.min_spend }"
            class="p-inputtext p-component"
            aria-describedby="promo-code-min-spend-error"
            placeholder="Min spend"
          />
          <small class="p-error" id="promo-code-min-spend-error">{{
            errors.min_spend || "&nbsp;"
          }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="max_spend">Max Spend</label>
          <Field
            v-model="promo_code.max_spend"
            id="max_spend"
            name="max_spend"
            :class="{ 'p-invalid': errors.max_spend }"
            class="p-inputtext p-component"
            aria-describedby="promo-code-max-spend-error"
            placeholder="Min spend"
          />
          <small class="p-error" id="promo-code-max-spend-error">{{
            errors.max_spend || "&nbsp;"
          }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="per_coupon_limit">Per Coupon Limit</label>
          <Field
            v-model="promo_code.per_coupon_limit"
            id="per_coupon_limit"
            name="per_coupon_limit"
            :class="{ 'p-invalid': errors.per_coupon_limit }"
            class="p-inputtext p-component"
            aria-describedby="promo-code-per-coupon-limit-error"
            placeholder="Enter per coupon limit"
          />
          <small class="p-error" id="promo-code-per-coupon-limit-error">{{
            errors.per_coupon_limit || "&nbsp;"
          }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="remaining_coupon">Remaining Coupon</label>
          <Field v-model="promo_code.remaining_coupon" id="remaining_coupon" name="remaining_coupon" :class="{ 'p-invalid': errors.remaining_coupon }" class="p-inputtext p-component" aria-describedby="promo-code-remaining-coupon-error" placeholder="Enter remaining coupon"/>
          <small class="p-error" id="promo-remaining-coupon-error">{{ errors.remaining_coupon || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="per_user_limit">Per User Limit</label>
          <Field v-model="promo_code.per_user_limit" id="per_user_limit" name="per_user_limit" :class="{ 'p-invalid': errors.per_user_limit }" class="p-inputtext p-component" aria-describedby="promo-code-per-user-limit-error" placeholder="Enter per user limit"/>
          <small class="p-error" id="promo-per-user-limit-error">{{ errors.per_user_limit || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label for="status">Status</label>
          <Field name="status" v-slot="{ field }">
            <Dropdown
              v-bind="field"
              v-model="promo_code.status"
              :options="status_enums"
              optionLabel="name"
              optionValue="name"
              placeholder="Select a status"
              display="chip"
              :class="{ 'p-invalid': errors.status }"
              aria-describedby="promo-code-status-error"
            ></Dropdown>
          </Field>
          <small class="p-error" id="promo-code-status-error">{{
            errors.status || "&nbsp;"
          }}</small>
        </div>
        <Button
          class=""
          type="submit"
          label="Submit"
          :loading="loading"
          icon="pi pi-check"
        />
      </Form>
    </template>
    <div class="flex justify-content-center">
      <ProgressSpinner v-if="spinner" />
    </div>
  </div>
</template>

<script lang="ts">
import { useToast } from "primevue/usetoast";
import { Field, Form, useField, useForm } from "vee-validate";
import { ref, defineComponent, nextTick, onMounted } from "vue";
import * as Yup from "yup";
import { useApiFetch } from "~/composables/useApiFetch";

export default defineComponent({
  components: { Form, Field },
  setup() {
    const { handleSubmit, resetForm } = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const categories = ref([]);
    const status_enums = ref([]);
    const discount_type_enums = ref([]);

    const promo_code = ref({
      name: "",
      description: "",
      discount_type: "",
      discount_amount: "",
      min_spend: "",
      max_spend: "",
      per_coupon_limit: "",
      remaining_coupon: "",
      per_user_limit: "",
      status: "",
    });

    onMounted(async () => {
      await nextTick();
      await fetchEnums();
      await fetchCategories();
    });

    const fetchEnums = async () => {
      spinner.value = true;
      const { data, error } = await useApiFetch("/api/getEnums", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getEnums = JSON.parse(
          JSON.stringify(computed(() => data.value).value)
        );
        status_enums.value = getEnums.statuses;
        discount_type_enums.value = getEnums.discount_types;
      }
    };
    const fetchCategories = async () => {
      const { data, error } = await useApiFetch("/api/categories", {
        method: "GET",
      });
      if (data.value) {
        const getCategories = JSON.parse(
          JSON.stringify(computed(() => data.value).value)
        );
        categories.value = getCategories.categories.data;
      }
    };

    const schema = Yup.object().shape({
      name: Yup.string().required().min(2).max(100).label("Name"),
      description: Yup.string().required().min(2).max(100).label("Description"),
      discount_type: Yup.string().required().min(2).max(100).label("Discount type"),
      discount_amount: Yup.number().typeError('Discount amount is required field').required().min(2).max(100).label("Discount amount"),
      // min_spend: Yup.number()
      //     .nullable()
      //     .test('is-min_spend-valid', 'Address must be at least 3 characters long and not exceed 100 characters', (value) => {
      //       if (!value) {
      //         // If address is null or undefined, it's considered valid
      //         return true;
      //       }
      //
      //       // Check the length of the address
      //       return value.length >= 3 && value.length <= 100;
      //     }),
      min_spend: Yup.number().typeError('Min spend is number field').nullable().label("Min spend"),
      max_spend: Yup.number().typeError('Max spend is number field').nullable().label("Max spend"),
      per_coupon_limit: Yup.number().typeError('Per coupon limit is number field').nullable().label("Per coupon limit"),
      remaining_coupon: Yup.number().typeError('Remaining coupon is number field').nullable().label("Remaining coupon"),
      per_user_limit: Yup.number().typeError('Per user limit is number field').nullable().label("Per user limit"),
      status: Yup.mixed().required().label("Status"),
    });

    const onSubmit = async (
      values: any,
      actions: { setErrors: (arg0: any) => void }
    ) => {
      loading.value = true;

      const { data, error } = await useApiFetch("/api/promo-codes", {
        method: "POST",
        body: promo_code.value,
      });
      loading.value = false;
      const data_obj = JSON.parse(
        JSON.stringify(computed(() => data.value).value)
      );
      const error_obj = JSON.parse(
        JSON.stringify(computed(() => error.value).value)
      );

      if (error_obj && Object.keys(error_obj).length > 0) {
        const errorList = error_obj.data.errors;
        actions.setErrors(errorList);
      }

      if (data.value) {
        const message = JSON.parse(
          JSON.stringify(computed(() => data_obj.message).value)
        );
        toast.add({
          severity: "info",
          summary: "Success",
          detail: message,
          life: 3000,
        });

        promo_code.value.discount_type = "";
        promo_code.value.status = "";
        resetModal();
        resetForm();
      }
    };

    const resetModal = () => {
      const resetForm = document.getElementById(
        "add_promo_code_form"
      ) as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      schema,
      onSubmit,
      promo_code,
      loading,
      fetching,
      spinner,
      resetModal,
      categories,
      status_enums,
      discount_type_enums,
    };
  },
});
</script>

<style scoped>
.p-checkbox {
  width: 18px !important;
  height: 18px !important;
}

.p-checkbox.p-invalid.p-component {
  border-color: #e24c4c;
}

.p-checkbox.p-invalid {
  border-color: #e24c4c;
}

.form-control[type="file"]:not(:disabled):not([readonly]) {
  cursor: pointer;
}

.form-control[type="file"] {
  overflow: hidden;
}
.form-control {
  color: #92929f;
  background-color: #1e1e2d;
  border: 1px solid #323248;
  box-shadow: none !important;
}
.form-control {
  display: block;
  width: 100%;
  padding: 0.75rem 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.5;
  color: #5e6278;
  background-color: #ffffff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.475rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.form-control.p-invalid {
  border-color: #f1416c;
  padding-right: calc(1.5em + 1.55rem);
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.3875rem) center;
  background-size: calc(0.75em + 0.775rem) calc(0.75em + 0.775rem);
}
</style>
