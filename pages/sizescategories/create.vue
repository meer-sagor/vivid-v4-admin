<template>
  <div class="card">
    <h5>Add Size Category</h5>
    <template v-if="fetching">
      <Form id="add_size_category_form" :initial-values="size_category" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">

        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="category_name">Category Name</label>
              <Field
                  v-model="size_category.category_name"
                  id="category_name"
                  name="category_name"
                  :class="{ 'p-invalid': errors.category_name }"
                  class="p-inputtext p-component"
                  aria-describedby="size-category-name-error"
                  placeholder="Enter name"
              />
              <small class="p-error" id="size-category-name-error">{{errors.category_name || "&nbsp;"}}</small>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="status">Status</label>
              <Field  name="status" v-slot="{ field, meta }">
                <Dropdown
                    v-bind="field"
                    v-model="size_category.status"
                    :options="status_enums"
                    optionLabel="name"
                    optionValue="name"
                    placeholder="Select a status"
                    display="chip"
                    :class="{ 'p-invalid': errors.status }"
                    aria-describedby="promo-code-status-error"
                ></Dropdown>
              </Field>
              <small class="p-error" id="promo-code-status-error">{{errors.status || "&nbsp;"}}</small>
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
  components: { Form, Field },
  setup: function () {
    const {handleSubmit, resetForm} = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const status_enums = ref([]);
    const router = useRouter();

    const size_category = ref({
      category_name: "",
      status: "ENABLE",
    });

    onMounted(async () => {
      await nextTick();
      await fetchEnums();
    });

    const fetchEnums = async () => {
      spinner.value = true;
      const {data, error} = await useApiFetch("/api/getEnums", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getEnums = JSON.parse(JSON.stringify(computed(() => data.value).value));
        status_enums.value = getEnums.statuses;
      }
    };

    const schema = Yup.object().shape({
      category_name: Yup.string().required().min(2).max(100).label("Category name"),
      status: Yup.string()
          .transform((currentValue, originalValue) => {
            return originalValue.value || currentValue;
          })
          .required().label("Status"),
    });

    const onSubmit = async (values: any, actions: { setErrors: (arg0: any) => void }) => {
      loading.value = true;

      const {data, error} = await useApiFetch("/api/size-categories", {
        method: "POST",
        body: size_category.value,
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

        await router.push({ path: "/sizescategories" })
        resetModal();
        resetForm();
      }
    };

    const resetModal = () => {
      const resetForm = document.getElementById("add_size_category_form") as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      schema,
      onSubmit,
      size_category,
      loading,
      fetching,
      spinner,
      resetModal,
      status_enums,
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
