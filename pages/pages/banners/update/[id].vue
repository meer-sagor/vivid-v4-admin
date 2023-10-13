<script lang="ts">
import { useToast } from "primevue/usetoast";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, FieldArray, Form, useForm } from "vee-validate";
import { useApiFetch } from "~/composables/useApiFetch";
import {useRoute, useRouter} from "vue-router";
import add_banner_validation from "@/pages/pages/banners/validation/add_banner_validation";
import {useImageUpload} from "~/components/image/useImageUpload";

export default defineComponent({
  components: { Form, Field, ErrorMessage, FieldArray },
  setup() {
    const { handleSubmit, resetForm } = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const statuses = ref([]);
    const pages = ref([]);
    const bannerValidationSchema = add_banner_validation;
    const route = useRoute();
    const router = useRouter();
    let {imageFile, imageUrl, handleImageSelected} = useImageUpload();

    onMounted(async () => {
      await nextTick();
      await fetchCodes();
      await fetchBanner();
    });

    const banner = ref({
      name: "",
      description: "",
      image: "",
      status: "ENABLE",
      pages: [] as any,
    });


    const handleDescriptionChange = (value: any) => {
      banner.value.description = value;
    };

    const fetchBanner = async () => {
      const {data, error} = await useApiFetch("/api/banners/" + route.params.id + '/edit', {
        method: "GET",
      });
      if (data.value) {
        const getBanner = JSON.parse(JSON.stringify(computed(() => data.value).value))
        banner.value = getBanner.banner;
      }
    };

    // @ts-ignore
    const onSubmit = async (values, actions: { setErrors: (arg0: any) => void }) => {
      if (banner.value.description == null || banner.value.description == "") {
        toast.add({
          severity: "info",
          summary: "Danger",
          detail: "Description is a required field",
          life: 3000,
        });
        return;
      }

      loading.value = true;

      const formData = new FormData();
      formData.append("name", banner.value.name);
      formData.append("description", banner.value.description);
      formData.append("pages", JSON.stringify(banner.value.pages));
      formData.append("status", banner.value.status);
      formData.append("image", imageFile.value);

      const { data, error } = await useApiFetch("/api/banners/update/" + route.params.id, {
        method: "POST",
        body: formData,
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

        await router.push({ path: "/pages/banners" });
        resetModal();
      }
    };

    const fetchCodes = async () => {
      spinner.value = true;
      const { data, error } = await useApiFetch("/api/faq/codes", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getCodes = JSON.parse(
            JSON.stringify(computed(() => data.value).value)
        );
        statuses.value = getCodes.statuses;
        pages.value = getCodes.pages;
      }
    };

    const resetModal = () => {
      const resetForm = document.getElementById("add_banner_form") as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      toast,
      onSubmit,
      fetchCodes,
      banner,
      loading,
      spinner,
      fetching,
      resetModal,
      statuses,
      pages,
      handleDescriptionChange,
      bannerValidationSchema,
      handleImageSelected,
    };
  },
});
</script>

<template>
  <div class="card">
    <h5>Create Banner</h5>
    <template v-if="fetching">
      <Form id="add_banner_form" @submit="onSubmit" :initial-values="banner" :validation-schema="bannerValidationSchema" v-slot="{ values, errors }">
        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="name">Name</label>
              <Field
                  v-model="banner.name"
                  id="name"
                  name="name"
                  :class="{ 'p-invalid': errors.name }"
                  class="p-inputtext p-component"
                  aria-describedby="banner-name-error"
                  placeholder="Enter name"
              />
              <small class="p-error" id="product-name-error">{{errors.name || "&nbsp;"}}</small>
            </div>
          </div>
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="pages">Pages</label>
              <Field name="pages" v-slot="{ field }">
                <MultiSelect
                    v-bind="field"
                    v-model="banner.pages"
                    :options="pages"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select a pages"
                    display="chip"
                    :class="{ 'p-invalid': errors.pages }"
                    aria-describedby="banner-pages-error"
                ></MultiSelect>
              </Field>
              <small class="p-error" id="banner-pages-error">{{ errors.pages || '&nbsp;' }}</small>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="image" class="mb-3">Banner Image <span style="font-weight: 100;">*Previous file <a :href="banner.media?.url" target="_blank">click here</a></span></label>
              <Field type="file" id="image" name="image" @change="handleImageSelected" class="form-control" :class="{ 'p-invalid': errors.image }" aria-describedby="banner-image-error" placeholder="Select image"/>
              <small class="p-error" id="banner-image-error">{{errors.image || "&nbsp;"}}</small>
            </div>
          </div>
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="status" class="mb-3">Status</label>
              <Field name="status" v-slot="{ field }">
                <Dropdown
                    v-bind="field"
                    id="status"
                    v-model="banner.status"
                    :options="statuses"
                    optionLabel="name"
                    optionValue="name"
                    placeholder="Select a Status"
                    display="chip"
                    :class="{ 'p-invalid': errors.status }"
                    aria-describedby="banner-status-error"
                >
                </Dropdown>
              </Field>
              <small class="p-error" id="banner-status-error">{{errors.status || "&nbsp;"}}</small>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-3 mb-3">
          <div class="col-6 mb-0">
            <div class="flex flex-column gap-2 mb-0">
              <label for="description">Description</label>
              <ClientOnly>
                <QuillEditor
                    :content="banner.description"
                    ref="editor"
                    v-model.content="banner.description"
                    theme="snow"
                    content-type="html"
                    :style="{ height: '200px' }"
                    @update:content="handleDescriptionChange"/>
              </ClientOnly>
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

<style scoped>
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
