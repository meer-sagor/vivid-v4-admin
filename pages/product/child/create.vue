<script lang="ts">
import { useToast } from "primevue/usetoast";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, FieldArray, Form, useForm } from "vee-validate";
import {useApiFetch} from "~/composables/useApiFetch";
import { useRouter } from "vue-router";
import add_child_product_validation from "~/pages/product/child/validation/add_child_product_validation";

export default defineComponent({
  components: { Form, Field, ErrorMessage, FieldArray },
  setup(){
    const { handleSubmit, resetForm } = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const statuses = ref([]);
    const colors = ref([]);
    const fabrics = ref([]);
    const sizes = ref([]);
    const childProductValidationSchema = add_child_product_validation;
    const router = useRouter();

    onMounted(async () => {
      await nextTick();
      await fetchCodes();
    });

    const child_product = ref({
      product_id: 3,
      color_id: '',
      fabric_id: '',
      quantity: '',
      status: '',
      sizes: [],
      is_primary: 1,
      image_id: 1,
      child_product_sides: [
        {
          side: 'front_side',
          image_id: 1,
        },
        {
          side: 'left_side',
          image_id: 1,
        }
      ],
    })

    const onUpload = () => {
      console.log("image");
    };

    const fetchCodes = async () => {
      spinner.value = true;
      const { data, error } = await useApiFetch("/api/product/codes", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getCodes = JSON.parse(JSON.stringify(computed(() => data.value).value));
        statuses.value = getCodes.statuses;
        colors.value = getCodes.colors;
        fabrics.value = getCodes.fabrics;
        sizes.value = getCodes.sizes;
      }
    };

    // @ts-ignore
    const onSubmit = async (values, actions: { setErrors: (arg0: any) => void }) => {


      loading.value = true;

      const { data, error } = await useApiFetch("/api/child-products/store", {
        method: "POST",
        body: child_product.value,
      });
      loading.value = false;
      const data_obj = JSON.parse(JSON.stringify(computed(() => data.value).value));
      const error_obj = JSON.parse(JSON.stringify(computed(() => error.value).value));

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

        await router.push({ path: "/product/child" });
        resetModal();
        resetForm();
      }
    };

    const resetModal = () => {
      const resetForm = document.getElementById("add_child_product_form") as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {fetchCodes, toast, loading, fetching, spinner, statuses, colors, fabrics, sizes,
      childProductValidationSchema, child_product, onSubmit, resetModal, onUpload}
  }
});

</script>

<template>
  <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
    <NuxtLink to="/product/child">
      <Button
        icon="pi pi-angle-left"
        label="Go Back"
        class="p-button-text mr-2 mb-2"
      />
    </NuxtLink>
  </div>
  <template v-if="fetching">
  <Form
      id="add_child_product_form"
      @submit="onSubmit"
      :initial-values="child_product"
      :validation-schema="childProductValidationSchema"
      v-slot="{ values, errors }"
  >

    <div class="card mb-4">
      <h5>Filters</h5>
      <div class="flex flex-row gap-3">
        <div class="col-3 mb-0">
          <div class="flex flex-column gap-2 mb-0">
            <label for="color_id" class="mb-3">Color</label>
            <Field name="color_id" v-slot="{ field }">
              <Dropdown
                  v-bind="field"
                  id="color_id"
                  v-model="child_product.color_id"
                  :options="colors"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select a color"
                  display="chip"
                  :class="{ 'p-invalid': errors.color_id }"
                  aria-describedby="child-product-color-id-error"
              >
                <template #option="slotProps">
                  <div class="flex align-items-center">
                    <div
                        :style="{
                        'background-color': '#' + slotProps.option.hex,
                        width: '20px',
                        height: '20px',
                        'border-radius': '50px',
                        'margin-right': '10px',
                      }"
                    ></div>
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
              </Dropdown>
            </Field>
            <small class="p-error" id="child-product-color-id-error">{{errors.color_id || "&nbsp;"}}</small>
          </div>
        </div>
        <div class="col-3 mb-0">
          <div class="flex flex-column gap-2 mb-0">
            <label for="fabric_id" class="mb-3">Fabric</label>
            <Field name="fabric_id" v-slot="{ field }">
              <Dropdown
                  v-bind="field"
                  id="fabric_id"
                  v-model="child_product.fabric_id"
                  :options="fabrics"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select a fabric"
                  display="chip"
                  :class="{ 'p-invalid': errors.fabric_id }"
                  aria-describedby="child-product-fabric-id-error"
              >
              </Dropdown>
            </Field>
            <small class="p-error" id="child-product-fabric-id-error">{{errors.fabric_id || "&nbsp;"}}</small>
          </div>
        </div>
        <div class="col-3 mb-0">
          <div class="flex flex-column gap-2 mb-0">
            <label for="status" class="mb-3">Status</label>
            <Field name="status" v-slot="{ field }">
              <Dropdown
                  v-bind="field"
                  id="status"
                  v-model="child_product.status"
                  :options="statuses"
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select a Status"
                  display="chip"
                  :class="{ 'p-invalid': errors.status }"
                  aria-describedby="child-product-status-error"
              >
              </Dropdown>
            </Field>
            <small class="p-error" id="child-product-status-error">{{errors.status || "&nbsp;"}}</small>
          </div>
        </div>
        <div class="col-3 mb-0">
          <div class="flex flex-column gap-2 mb-0">
            <label for="quantity" class="mb-3">Quantity</label>
            <Field
                v-model="child_product.quantity"
                id="quantity"
                name="quantity"
                :class="{ 'p-invalid': errors.quantity }"
                class="p-inputtext p-component"
                aria-describedby="child-product-quantity-error"
                placeholder="Enter min quanity"
            />
            <small class="p-error" id="child-product-quantity-error">{{errors.quantity || "&nbsp;"}}</small>
          </div>
        </div>
      </div>
    </div>
    <div class="grid p-fluid">
      <div class="col-12 md:col-3">
        <div class="card text-center mb-3">
          <h5 class="mb-4">Catalog Image</h5>
          <FileUpload
            mode="basic"
            name="demo[]"
            accept="image/*"
            :maxFileSize="1000000"
            @uploader="onUpload"
            customUpload
          />
        </div>
        <div class="card mb-3">
          <h5 class="mb-4">Sizes</h5>
          <div class="flex flex-column gap-2 mb-0">
            <Field name="sizes" v-slot="{ field }">
              <MultiSelect
                  v-bind="field"
                  v-model="child_product.sizes"
                  :options="sizes"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select sizes"
                  display="chip"
                  :class="{ 'p-invalid': errors.sizes }"
                  aria-describedby="child-product-sizes-error"
              ></MultiSelect>
            </Field>
            <small class="p-error" id="child-product-sizes-error">{{ errors.sizes || '&nbsp;' }}</small>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-9">
        <div class="card text-center mb-3">
          <div class="grid p-fluid">
            <div class="col-12 md:col-3">
              <div class="card text-center">
                <h5 class="mb-4">Front Side</h5>
                <div class="mb-3">
                  <img src="/images/placeholder.svg" alt="" height="100" />
                </div>
                <div class="flex gap-3 flex justify-content-center">
                  <FileUpload
                    class="file-upload-btn"
                    mode="basic"
                    name="demo[]"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @uploader="onUpload"
                    customUpload
                  />
                </div>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="card">
                <h5 class="mb-4">Right Side</h5>
                <div class="mb-3">
                  <img src="/images/placeholder.svg" alt="" height="100" />
                </div>
                <div class="flex gap-3 flex justify-content-center">
                  <FileUpload
                    class="file-upload-btn"
                    mode="basic"
                    name="demo[]"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @uploader="onUpload"
                    customUpload
                  />
                </div>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="card">
                <h5 class="mb-4">Back Side</h5>
                <div class="mb-3">
                  <img src="/images/placeholder.svg" alt="" height="100" />
                </div>
                <div class="flex gap-3 flex justify-content-center">
                  <FileUpload
                    class="file-upload-btn"
                    mode="basic"
                    name="demo[]"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @uploader="onUpload"
                    customUpload
                  />
                </div>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="card">
                <h5 class="mb-4">Left Side</h5>
                <div class="mb-3">
                  <img src="/images/placeholder.svg" alt="" height="100" />
                </div>
                <div class="flex gap-3 flex justify-content-center">
                  <!-- <div class="field-checkbox mb-0">
                    <Checkbox
                      id="checkOption1"
                      v-model="checkboxValue1"
                      name="option"
                      value="Chicago"
                    />
                  </div> -->
                  <FileUpload
                    class="file-upload-btn"
                    mode="basic"
                    name="demo[]"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @uploader="onUpload"
                    customUpload
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card flex flex-column md:flex-row md:justify-content-end md:align-items-center">
          <div class="field">
            <Button type="submit" style="min-width: 150px" label="Save" />
          </div>
        </div>
      </div>
    </div>
  </Form>
  </template>
  <div class="flex justify-content-center">
    <ProgressSpinner v-if="spinner" />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
