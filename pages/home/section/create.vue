<template>
  <div class="card">
    <h5>Add Home Section</h5>
    <template v-if="fetching">
      <Form id="add_home_section_form" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
        <div class="flex flex-column gap-2 mb-1">
          <label for="name">Name</label>
          <Field v-model="home_section.name" id="name" name="name" :class="{ 'p-invalid': errors.name }" class="p-inputtext p-component" aria-describedby="home-section-name-error" placeholder="Name"/>
          <small class="p-error" id="home-section-name-error">{{ errors.name || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="section_title">Section title</label>
          <Field v-model="home_section.section_title" id="section_title" name="section_title" :class="{ 'p-invalid': errors.section_title }" class="p-inputtext p-component" aria-describedby="home-section-section-title-error" placeholder="Section title"/>
          <small class="p-error" id="home-section-last-name-error">{{ errors.section_title || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="description">Description</label>
          <ClientOnly>
            <QuillEditor
                ref="editor"
                v-model.content="home_section.description"
                theme="snow"
                content-type="html"
                :style="{ height: '200px' }"
                @update:content="handleChange"/>
          </ClientOnly>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="view_all_url">Url</label>
          <Field v-model="home_section.view_all_url" id="view_all_url" name="view_all_url" :class="{ 'p-invalid': errors.view_all_url }" class="p-inputtext p-component" aria-describedby="home-section-view-all-url-error" placeholder="Enter url"/>
          <small class="p-error" id="home-section-view-all-url-error">{{ errors.view_all_url || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="categories">Categories</label>
          <Field name="categories" v-slot="{ field }">
            <MultiSelect
                v-bind="field"
                v-model="home_section.categories"
                :options="categories"
                optionLabel="name"
                optionValue="id"
                placeholder="Select a categories"
                display="chip"
                :class="{ 'p-invalid': errors.categories }"
                aria-describedby="associate-categories-error"
            ></MultiSelect>
          </Field>
          <small class="p-error" id="associate-categories-error">{{ errors.categories || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label for="status">Status</label>
          <Field name="status" v-slot="{ field }">
            <Dropdown
                v-bind="field"
                v-model="home_section.status"
                :options="status_enums"
                optionLabel="name"
                optionValue="name"
                placeholder="Select a status"
                display="chip"
                :class="{ 'p-invalid': errors.status }"
                aria-describedby="associate-status-error"
            ></Dropdown>
          </Field>
          <small class="p-error" id="associate-status-error">{{ errors.status || '&nbsp;' }}</small>
        </div>
        <Button class="" type="submit" label="Submit" :loading="loading" icon="pi pi-check"/>
      </Form>
    </template>
    <div class="flex justify-content-center">
      <ProgressSpinner v-if="spinner"/>
    </div>
  </div>
</template>

<script lang="ts">
import {useToast} from 'primevue/usetoast';
import {Field, Form, useField, useForm} from 'vee-validate';
import {ref, defineComponent, nextTick, onMounted} from "vue";
import * as Yup from "yup";
import {useApiFetch} from "~/composables/useApiFetch";
import {useImageUpload} from "~/components/image/useImageUpload.js";
import {useRouter} from "vue-router";

export default defineComponent({
  components: {Form, Field},
  setup() {
    const {handleSubmit, resetForm} = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const categories = ref([]);
    const status_enums = ref([]);
    const router = useRouter();

    const home_section = ref({
      name: "",
      section_title: "",
      description: "",
      view_all_url: "",
      categories: [],
      status: "",
    });

    onMounted(async () => {
      await nextTick();
      await fetchEnums();
      await fetchCategories();
    });

    const fetchEnums = async () => {
      spinner.value = true
      const {data, error} = await useApiFetch("/api/getEnums", {
        method: "GET",
      });
      spinner.value = false
      if (data.value) {
        fetching.value = true
        const getEnums = JSON.parse(JSON.stringify(computed(() => data.value).value))
        status_enums.value = getEnums.statuses;
      }
    };
    const fetchCategories = async () => {
      const {data, error} = await useApiFetch("/api/categories", {
        method: "GET",
      });
      if (data.value) {
        const getCategories = JSON.parse(JSON.stringify(computed(() => data.value).value))
        categories.value = getCategories.categories.data;
      }
    };

    const schema = Yup.object().shape({
      name: Yup.string().required().min(2).max(100).label("Name"),
      section_title: Yup.string().required().min(2).max(100).label("Section title"),
      view_all_url: Yup.string().url().required().min(2).max(100).label("Url"),
      categories: Yup.mixed().required().label("Categories"),
      status: Yup.mixed().required().label("Status"),
    });

    const onSubmit = async (values: any, actions: { setErrors: (arg0: any) => void; }) => {

      if (home_section.value.description == null || home_section.value.description == '') {
        toast.add({
          severity: "info",
          summary: "Danger",
          detail: 'Description is a required field',
          life: 3000,
        });
        return;
      }

      loading.value = true

      const {data, error} = await useApiFetch("/api/home-sections", {
        method: "POST",
        body: home_section.value,
      });
      loading.value = false
      const data_obj = JSON.parse(JSON.stringify(computed(() => data.value).value))
      const error_obj = JSON.parse(JSON.stringify(computed(() => error.value).value))

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

        await router.push({ path: "/home/sections" });
        home_section.value.categories = []
        home_section.value.status = ''
        resetModal();
        resetForm()
      }

    };

    const resetModal = () => {
      const resetForm = document.getElementById('add_home_section_form') as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    const handleChange = (value: any) => {
      home_section.value.description = value
    };

    return {
      schema, onSubmit, home_section, loading, fetching, spinner, resetModal, categories, status_enums, handleChange
    }

  }
})

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

.form-control[type=file]:not(:disabled):not([readonly]) {
  cursor: pointer;
}

 .form-control[type=file] {
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
   padding: 0.75rem 0.75rem;;
   font-size: 1.1rem;
   font-weight: 500;
   line-height: 1.5;
   color: #5E6278;
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
