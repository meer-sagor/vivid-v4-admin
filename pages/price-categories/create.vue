<template>
  <div class="card">
    <h5>Add Price Category</h5>
    <template v-if="fetching">
      <Form id="add_price_category_form" :initial-values="price_category" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">

        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="name">Name</label>
              <Field
                  v-model="price_category.name"
                  id="name"
                  name="name"
                  :class="{ 'p-invalid': errors.name }"
                  class="p-inputtext p-component"
                  aria-describedby="font-name-error"
                  placeholder="Enter name"
              />
              <small class="p-error" id="font-name-error">{{errors.name || "&nbsp;"}}</small>
            </div>
          </div>
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="size_id">Size</label>
              <Field name="size_id" v-slot="{ field }">
                <Dropdown
                    v-bind="field"
                    v-model="price_category.size_id"
                    :options="sizes"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select a size"
                    display="chip"
                    :class="{ 'p-invalid': errors.size_id }"
                    aria-describedby="price-size-error"
                ></Dropdown>

                <option :value="''">Select a status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Field>
              <small class="p-error" id="price-size-error">{{errors.size_id || "&nbsp;"}}</small>
            </div>
          </div>
        </div>
        <Button class="" type="submit" label="Submit" :loading="loading" icon="pi pi-check"/>
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
import {useRouter} from "vue-router";

export default defineComponent({
  middleware: ["auth"],
  components: { Form, Field },
  setup: function () {
    const {handleSubmit, resetForm} = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const router = useRouter();
    const sizes = ref([])

    const price_category = ref({
      name: "",
      size_id: "",
    });

    onMounted(async () => {
      await nextTick();
      await fetchSizes();
    });

    const fetchSizes = async () => {
      spinner.value = true;
      const {data, error} = await useApiFetch("/api/price-category/codes", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getSizes = JSON.parse(JSON.stringify(computed(() => data.value).value));
        sizes.value = getSizes.sizes;
      }
    };

    const schema = Yup.object().shape({
      name: Yup.string().required().min(1).max(100).label("Name"),
      size_id: Yup.mixed().required().label("Size"),
    });

    const onSubmit = async (values: any, actions: { setErrors: (arg0: any) => void }) => {
      loading.value = true;

      const {data, error} = await useApiFetch("/api/price-categories", {
        method: "POST",
        body: price_category.value,
      });
      loading.value = false;
      const data_obj = JSON.parse(JSON.stringify(computed(() => data.value).value));
      const error_obj = JSON.parse(JSON.stringify(computed(() => error.value).value));

      if (error_obj && Object.keys(error_obj).length > 0) {
        const errorList = error_obj.data.errors;
        actions.setErrors(errorList);
      }

      if (data.value) {
        const message = JSON.parse(JSON.stringify(computed(() => data_obj.message).value));
        toast.add({
          severity: "info",
          summary: "Success",
          detail: message,
          life: 3000,
        });

        await router.push({ path: "/price-categories" });
        resetModal();
        resetForm();
      }
    };


    const resetModal = () => {
      const resetForm = document.getElementById("add_price_category_form") as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };


    return {
      schema,
      onSubmit,
      price_category,
      loading,
      fetching,
      spinner,
      resetModal,
      sizes,
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

.p-editor-container.p-invalid {
  border: 1px solid #e24c4c !important;
  border-radius: 6px;
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
