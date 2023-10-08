<template>
  <div class="card">
    <h5>Add Font Category</h5>
    <template v-if="fetching">
      <Form id="add_font_form" :initial-values="font" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="name">Name</label>
              <Field
                  v-model="font.name"
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
              <label for="size">Size</label>
              <Field
                  v-model="font.size"
                  id="size"
                  name="size"
                  :class="{ 'p-invalid': errors.size }"
                  class="p-inputtext p-component"
                  aria-describedby="font-size-error"
                  placeholder="Enter size"
              />
              <small class="p-error" id="font-size-error">{{errors.size || "&nbsp;"}}</small>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="file_type">Font Type</label>
              <Field name="file_type" v-slot="{ field }">
                <Dropdown
                    v-bind="field"
                    v-model="font.file_type"
                    :options="font_file_type_enums"
                    optionLabel="name"
                    optionValue="name"
                    placeholder="Select a file type"
                    display="chip"
                    :class="{ 'p-invalid': errors.file_type }"
                    aria-describedby="promo-file-error"
                ></Dropdown>
              </Field>

              <small class="p-error" id="font-file-error">{{errors.file_type || "&nbsp;"}}</small>
            </div>
          </div>
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="font_category_id">Font Category</label>
              <Field name="font_category_id" v-slot="{ field }">
                <Dropdown
                    v-bind="field"
                    v-model="font.font_category_id"
                    :options="font_categories"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select a font category"
                    display="chip"
                    :class="{ 'p-invalid': errors.font_category_id }"
                    aria-describedby="font-font-category-error"
                ></Dropdown>
              </Field>
              <small class="p-error" id="font-font-category-error">{{errors.font_category_id || "&nbsp;"}}</small>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="file">File</label>
              <Field type="file" id="file" name="file" @change="handleImageSelected" class="form-control" :class="{ 'p-invalid': errors.file }" aria-describedby="font-file-error" placeholder="Select file"/>
              <small class="p-error" id="font-file-error">{{errors.file || "&nbsp;"}}</small>
            </div>
          </div>
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="status">Status</label>
              <Field name="status" v-slot="{ field }">
                <Dropdown
                    v-bind="field"
                    v-model="font.status"
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
import {useImageUpload} from "~/components/image/useImageUpload";

export default defineComponent({
  components: { Form, Field },
  setup: function () {
    const {handleSubmit, resetForm} = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const status_enums = ref([]);
    const font_file_type_enums = ref([]);
    const font_categories = ref([]);
    const router = useRouter();
    let {imageFile, imageUrl, handleImageSelected} = useImageUpload();

    const font = ref({
      name: "",
      size: "",
      file_type: "",
      font_category_id: "",
      status: "ENABLE",
    });

    onMounted(async () => {
      await nextTick();
      await fetchEnums();
      await fetchFontCategories();
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
        font_file_type_enums.value = getEnums.font_file_types;
      }
    };

    const fetchFontCategories = async () => {
      const {data, error} = await useApiFetch("/api/font-categories", {
        method: "GET",
      });
      if (data.value) {
        const getFontCategories = JSON.parse(JSON.stringify(computed(() => data.value).value));
        font_categories.value = getFontCategories.font_categories;
      }
    };

    const schema = Yup.object().shape({
      name: Yup.string().required().min(2).max(100).label("Name"),
      size: Yup.number().typeError('Size must be a number field.').required().min(2).max(2000).label("Size"),
      file_type: Yup.mixed().required().typeError('File type is a required field').label("Font type"),
      font_category_id: Yup.mixed().required().typeError('Font category is a required field').label("Font category"),
      file: Yup.mixed().required().label("File"),
      status: Yup.mixed().required().label("Status"),
    });

    const onSubmit = async (values: any, actions: { setErrors: (arg0: any) => void }) => {
      loading.value = true;

      const formData = new FormData();
      formData.append("name", font.value.name);
      formData.append("size", font.value.size);
      formData.append("file_type", font.value.file_type);
      formData.append("font_category_id", font.value.font_category_id);
      formData.append("status",  font.value.status);
      formData.append("image", imageFile.value);

      const {data, error} = await useApiFetch("/api/fonts", {
        method: "POST",
        body: formData,
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

        await router.push({ path: "/fonts" });
        resetModal();
        resetForm();
      }
    };


    const resetModal = () => {
      const resetForm = document.getElementById("add_font_form") as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };


    return {
      schema,
      onSubmit,
      font,
      loading,
      fetching,
      spinner,
      resetModal,
      status_enums,
      font_file_type_enums,
      font_categories,
      handleImageSelected,
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
