<script lang="ts">
import { useToast } from "primevue/usetoast";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, FieldArray, Form, useForm } from "vee-validate";
import * as Yup from "yup";
import { useApiFetch } from "~/composables/useApiFetch";
import add_product_validation from "@/pages/product/validation/add_product_validation";
import { useRouter } from "vue-router";
import { ProductService } from "@/service/ProductService";

export default defineComponent({
  components: { Form, Field, ErrorMessage, FieldArray },
  setup() {
    const { handleSubmit, resetForm } = useForm();
    const toast = useToast();
    const products = ref(null);
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const statuses = ref([]);
    const categories = ref([]);
    const sub_categories = ref([]);
    const fabrics = ref([]);
    const brands = ref([]);
    const price_categories = ref([]);
    const sizes = ref([]);
    const productValidationSchema = add_product_validation;
    const router = useRouter();

    onMounted(async () => {
      await nextTick();
      await fetchCodes();

      ProductService.getProductsMini().then((data) => (products.value = data));
    });

    const product = ref({
      name: "",
      url_key: "",
      style_number: "",
      sku: "",
      default_printing: false,
      default_embroidery: false,
      quantity: "",
      fabric_id: "",
      category_id: "",
      sub_category_id: "",
      brand_id: "",
      description: "",
      size_chart_description: "",
      status: "enable",
      primary_image_id: 1,
      additional_images: [1, 2, 3],
      size_charts: [
        {
          size_id: "",
          width: "",
          length: "",
        },
      ],
      price_shirt_charts: [
        {
          price_category_id: "",
          range_from: "",
          range_to: "",
          price: "",
        },
      ],
    });

    const onUpload = () => {
      console.log("image");
    };

    const handleDescriptionChange = (value: any) => {
      product.value.description = value;
    };
    const handleSizeChartDescriptionChange = (value: any) => {
      product.value.size_chart_description = value;
    };

    // @ts-ignore
    const onSubmit = async (
      values,
      actions: { setErrors: (arg0: any) => void }
    ) => {
      if (
        product.value.description == null ||
        product.value.description == ""
      ) {
        toast.add({
          severity: "info",
          summary: "Danger",
          detail: "Description is a required field",
          life: 3000,
        });
        return;
      }
      if (
        product.value.size_chart_description == null ||
        product.value.size_chart_description == ""
      ) {
        toast.add({
          severity: "info",
          summary: "Danger",
          detail: "Size chart description is a required field",
          life: 3000,
        });
        return;
      }

      loading.value = true;
      product.value.size_charts = values.size_charts;
      product.value.price_shirt_charts = values.price_shirt_charts;

      const { data, error } = await useApiFetch("/api/products/store", {
        method: "POST",
        body: product.value,
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

        await router.push({ path: "/product" });
        resetModal();
        resetForm();
      }
    };

    const fetchCodes = async () => {
      spinner.value = true;
      const { data, error } = await useApiFetch("/api/product/codes", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getCodes = JSON.parse(
          JSON.stringify(computed(() => data.value).value)
        );
        statuses.value = getCodes.statuses;
        categories.value = getCodes.categories;
        sub_categories.value = getCodes.sub_categories;
        fabrics.value = getCodes.fabrics;
        brands.value = getCodes.brands;
        price_categories.value = getCodes.price_categories;
        sizes.value = getCodes.sizes;
      }
    };
    const createNewDialog = ref(false);

    const openNew = () => {
      createNewDialog.value = true;
    };

    const resetModal = () => {
      const resetForm = document.getElementById(
        "add_product_form"
      ) as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      createNewDialog,
      toast,
      sizes,
      onSubmit,
      fetchCodes,
      productValidationSchema,
      handleDescriptionChange,
      handleSizeChartDescriptionChange,
      product,
      products,
      loading,
      spinner,
      fetching,
      resetModal,
      statuses,
      categories,
      fabrics,
      brands,
      price_categories,
      sub_categories,
      onUpload,
      openNew,
    };
  },
});
</script>

<template>
  <div>
    <div
      class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
    >
      <NuxtLink to="/product">
        <Button
          icon="pi pi-angle-left"
          label="Go Back"
          class="p-button-text mr-2 mb-2"
        />
      </NuxtLink>
    </div>
    <template v-if="fetching">
      <Form
        id="add_product_form"
        @submit="onSubmit"
        :initial-values="product"
        :validation-schema="productValidationSchema"
        v-slot="{ values, errors }"
      >
        <div class="grid">
          <div class="col-12">
            <div class="card p-fluid">
              <h5>Create FAQ</h5>

              <div class="grid">
                <div class="col-4">
                  <div class="field mt-4">
                    <label for="name">Title</label>
                    <Field
                      v-model="product.name"
                      id="name"
                      name="name"
                      :class="{ 'p-invalid': errors.name }"
                      class="p-inputtext p-component"
                      aria-describedby="product-name-error"
                      placeholder="Enter Title"
                    />
                    <small class="p-error" id="product-name-error">{{
                      errors.name || "&nbsp;"
                    }}</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="field mt-4">
                    <label for="status" class="mb-3">Status</label>
                    <Field name="status" v-slot="{ field }">
                      <Dropdown
                        v-bind="field"
                        id="status"
                        v-model="product.status"
                        :options="statuses"
                        optionLabel="name"
                        optionValue="name"
                        placeholder="Select a Status"
                        display="chip"
                        :class="{ 'p-invalid': errors.status }"
                        aria-describedby="product-status-error"
                      >
                      </Dropdown>
                    </Field>
                    <small class="p-error" id="product-status-error">{{
                      errors.status || "&nbsp;"
                    }}</small>
                  </div>
                </div>

                <div class="col-4">
                  <div class="field mt-4">
                    <label for="name">Pages</label>
                    <MultiSelect
                      v-model="multiselectValue"
                      :options="multiselectValues"
                      optionLabel="name"
                      placeholder="Select Pages"
                      :filter="true"
                    >
                      <template #value="slotProps">
                        <div
                          v-for="option of slotProps.value"
                          :key="option.code"
                          class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2"
                        >
                          <span
                            :class="
                              'mr-2 flag flag-' + option.code.toLowerCase()
                            "
                            style="width: 18px; height: 12px"
                          />
                          <div>{{ option.name }}</div>
                        </div>
                        <template
                          v-if="
                            !slotProps.value || slotProps.value.length === 0
                          "
                        >
                          <div class="p-1">Select Pages</div>
                        </template>
                      </template>
                    </MultiSelect>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="card">
                  <FieldArray
                    name="price_shirt_charts"
                    v-slot="{ fields, push, remove }"
                  >
                    <div
                      class="flex justify-content-between flex-column sm:flex-row mb-3"
                    >
                      <h4>Price Shirt Chart</h4>

                      <Button
                        style="width: auto"
                        type="submit"
                        label="New"
                        @click="openNew"
                      ></Button>
                    </div>

                    <div class="field">
                      <DataTable
                        :value="products"
                        tableStyle="min-width: 50rem"
                      >
                        <Column field="name" header="Question"></Column>
                        <Column field="name" header="Answer"></Column>
                        <Column
                          field="inventoryStatus"
                          header="Status"
                          :sortable="true"
                        >
                          <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span
                              :class="
                                'product-badge status-' +
                                (slotProps.data.inventoryStatus
                                  ? slotProps.data.inventoryStatus.toLowerCase()
                                  : '')
                              "
                              >{{ slotProps.data.inventoryStatus }}</span
                            >
                          </template>
                        </Column>

                        <Column header="Action" style="max-width: 50px">
                          <template #body>
                            <span class="p-buttonset">
                              <Button
                                icon="pi pi-pencil"
                                class="p-button-text p-button-rounded mr-2"
                              />

                              <Button
                                icon="pi pi-trash"
                                severity="danger"
                                class="p-button-text p-button-rounded"
                              />
                            </span>
                          </template>
                        </Column>
                      </DataTable>
                    </div>
                  </FieldArray>
                  <!-- <div class="field">
                <div
                  class="formgrid"
                  style="
                    border: 1px solid #e4e4e4;
                    border-radius: 12px;
                    padding: 16px;
                  "
                >
                  
                </div>
              </div> -->

                  <!-- <ClothCustom /> -->
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div
              class="card p-fluid flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <div class="field">
                <Button
                  style="min-width: 150px"
                  label="Cancel"
                  class="p-button-text"
                />
              </div>
              <div class="field">
                <Button type="submit" style="min-width: 150px" label="Save" />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </template>

    <Dialog
      v-model:visible="createNewDialog"
      style="min-width: 600px"
      header="Edit Details"
      :modal="true"
      class="p-fluid"
    >
      <Form
        id="add_role_form"
        @submit="saveProduct"
        :initial-values="product"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <div class="field">
          <label for="Types">Type</label>
          <Field name="types" v-slot="{ field }">
            <Dropdown
              :disabled="loading"
              v-bind="field"
              v-model="product.type"
              :options="types"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a Type"
              display="chip"
              :class="{ 'p-invalid': errors.type }"
              aria-describedby="category-code-type-error"
            ></Dropdown>
          </Field>
          <small class="p-error" id="category-code-type-error">{{
            errors.type || "&nbsp;"
          }}</small>
        </div>

        <div class="field">
          <label for="question">Question</label>
          <Field
            v-model="product.name"
            id="name"
            :disabled="loading"
            name="name"
            :class="{ 'p-invalid': errors.name }"
            class="p-inputtext p-component"
            aria-describedby="category-name-error"
            placeholder="Question"
          />
          <small class="p-error" id="category-name-error">{{
            errors.name || "&nbsp;"
          }}</small>
        </div>

        <div class="field">
          <label for="description">Answer</label>

          <ClientOnly>
            <QuillEditor
              ref="editor"
              v-model.content="product.description"
              theme="snow"
              content-type="html"
              :style="{ height: '200px' }"
              @update:content="handleDescriptionChange"
            />
          </ClientOnly>
        </div>
        <div class="field">
          <label for="inventoryStatus" class="mb-3">Status</label>
          <Field name="status" v-slot="{ field }">
            <Dropdown
              :disabled="loading"
              v-bind="field"
              v-model="product.status"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a status"
              display="chip"
              :class="{ 'p-invalid': errors.status }"
              aria-describedby="category-code-status-error"
            ></Dropdown>
          </Field>
          <small class="p-error" id="category-code-status-error">{{
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
        <!-- </template> -->
      </Form>
    </Dialog>

    <div class="flex justify-content-center">
      <ProgressSpinner v-if="spinner" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
