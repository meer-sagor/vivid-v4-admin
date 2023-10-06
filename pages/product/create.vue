<script lang="ts">
import { useToast } from "primevue/usetoast";
import { defineComponent, nextTick, onMounted, ref} from "vue";
import {ErrorMessage, Field, FieldArray, Form, useForm} from 'vee-validate';
import * as Yup from "yup";
import {useApiFetch} from "~/composables/useApiFetch";
import add_product_validation from "@/pages/product/validation/add_product_validation";
import {useRouter} from "vue-router";

export default defineComponent({
  components: {Form, Field, ErrorMessage, FieldArray},
  setup() {
    const {handleSubmit, resetForm} = useForm();
    const toast = useToast();
    const products = ref(null);
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const statuses = ref([]);
    const categories = ref([]);
    const sub_categories = ref([])
    const fabrics = ref([])
    const brands = ref([])
    const price_categories = ref([])
    const sizes = ref([])
    const productValidationSchema = add_product_validation;
    const router = useRouter();

    onMounted(async() => {
      await nextTick();
      await fetchCodes()
    });

    const product = ref({
      name: '',
      url_key: '',
      style_number: '',
      sku: '',
      default_printing: false,
      default_embroidery: false,
      quantity: '',
      fabric_id: '',
      category_id: '',
      sub_category_id: '',
      brand_id: '',
      description: '',
      size_chart_description: '',
      status: 'enable',
      primary_image_id: 1,
      additional_images: [1, 2,3],
      size_charts: [{
        size_id: '',
        width: '',
        length: '',
      }],
      price_shirt_charts: [{
        price_category_id: '',
        range_from: '',
        range_to: '',
        price: '',
      }],
    });

    const onUpload = () => {
      console.log('image')
    }

    const handleDescriptionChange = (value: any) => {
      product.value.description = value;
    }
    const handleSizeChartDescriptionChange = (value: any) => {
      product.value.size_chart_description = value;
    }

    // @ts-ignore
    const onSubmit = async (values, actions: { setErrors: (arg0: any) => void }) => {

      // if (product.value.description == null || product.value.description == '') {
      //   toast.add({
      //     severity: "info",
      //     summary: "Danger",
      //     detail: 'Description is a required field',
      //     life: 3000,
      //   });
      //   return;
      // }
      // if (product.value.size_chart_description == null || product.value.size_chart_description == '') {
      //   toast.add({
      //     severity: "info",
      //     summary: "Danger",
      //     detail: 'Size chart description is a required field',
      //     life: 3000,
      //   });
      //   return;
      // }

      loading.value = true;
      product.value.size_charts = values.size_charts
      product.value.price_shirt_charts = values.price_shirt_charts

      const {data, error} = await useApiFetch("/api/products/store", {
        method: "POST",
        body: product.value,
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

        await router.push({ path: "/product" });
        resetModal();
        resetForm();
      }
    };

    const fetchCodes = async () => {
      spinner.value = true;
      const {data, error} = await useApiFetch("/api/product/codes", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getCodes = JSON.parse(JSON.stringify(computed(() => data.value).value));
        statuses.value = getCodes.statuses;
        categories.value = getCodes.categories;
        sub_categories.value = getCodes.sub_categories;
        fabrics.value = getCodes.fabrics;
        brands.value = getCodes.brands;
        price_categories.value = getCodes.price_categories;
        sizes.value = getCodes.sizes;
      }
    };

    const resetModal = () => {
      const resetForm = document.getElementById("add_product_form") as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      toast, sizes, onSubmit, fetchCodes, productValidationSchema, handleDescriptionChange, handleSizeChartDescriptionChange,
      product, products, loading, spinner, fetching, resetModal, statuses, categories, fabrics, brands, price_categories, sub_categories, onUpload,

    }
  }
})
</script>

<template>
  <div>
    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <NuxtLink to="/product">
        <Button
            icon="pi pi-angle-left"
            label="Go Back"
            class="p-button-text mr-2 mb-2"
        />
      </NuxtLink>
    </div>
    <template v-if="fetching">
    <Form id="add_product_form" @submit="onSubmit" :initial-values="product" :validation-schema="productValidationSchema" v-slot="{values, errors }">
      <div class="grid">
          <div class="col-8">
            <div class="card p-fluid">
              <h5>Create Product</h5>
              <div class="field mt-4">
                <label for="name">Name</label>
                <Field
                    v-model="product.name"
                    id="name"
                    name="name"
                    :class="{ 'p-invalid': errors.name }"
                    class="p-inputtext p-component"
                    aria-describedby="product-name-error"
                    placeholder="Enter name"
                />
                <small class="p-error" id="product-name-error">{{errors.name || "&nbsp;"}}</small>
              </div>

              <div class="formgrid grid">
                <div class="field col">
                  <label for="url_key" class="mb-3">URL Key</label>
                  <Field
                      v-model="product.url_key"
                      id="url_key"
                      name="url_key"
                      :class="{ 'p-invalid': errors.url_key }"
                      class="p-inputtext p-component"
                      aria-describedby="product-url-key-error"
                      placeholder="Enter url key"
                  />
                  <small class="p-error" id="product-url-key-error">{{errors.url_key || "&nbsp;"}}</small>
                </div>
                <div class="field col">
                  <label for="style_number" class="mb-3">Style Number</label>
                  <Field
                      v-model="product.style_number"
                      id="style_number"
                      name="style_number"
                      :class="{ 'p-invalid': errors.style_number }"
                      class="p-inputtext p-component"
                      aria-describedby="product-style-number-error"
                      placeholder="Enter url key"
                  />
                  <small class="p-error" id="product-style-number-error">{{errors.style_number || "&nbsp;"}}</small>
                </div>
              </div>

              <div class="formgrid grid md:align-items-center">
                <div class="field col">
                  <label for="sku" class="mb-3">SKU</label>
                  <Field
                      v-model="product.sku"
                      id="sku"
                      name="sku"
                      :class="{ 'p-invalid': errors.sku }"
                      class="p-inputtext p-component"
                      aria-describedby="product-sku-error"
                      placeholder="Enter sku"
                  />
                  <small class="p-error" id="product-sku-error">{{errors.sku || "&nbsp;"}}</small>
                </div>
                <div class="field col">
                  <label for="quantity" class="mb-3">Quantity</label>
                  <Field
                      v-model="product.quantity"
                      id="quantity"
                      name="quantity"
                      :class="{ 'p-invalid': errors.quantity }"
                      class="p-inputtext p-component"
                      aria-describedby="product-quantity-error"
                      placeholder="Enter quantity"
                  />
                  <small class="p-error" id="product-quantity-error">{{errors.quantity || "&nbsp;"}}</small>
                </div>
              </div>

              <div class="field">
                <label for="description" class="mb-3">Description</label>
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
                <label for="size_chart_description" class="mb-3">Size Chart Description</label>
                <ClientOnly>
                  <QuillEditor
                      ref="editor"
                      v-model.content="product.size_chart_description"
                      theme="snow"
                      content-type="html"
                      :style="{ height: '200px' }"
                      @update:content="handleSizeChartDescriptionChange"
                  />
                </ClientOnly>
              </div>

              <div class="field">
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
                <small class="p-error" id="product-status-error">{{errors.status || "&nbsp;"}}</small>
              </div>
            </div>
          </div>
          <!--    LeftSidebar-->
          <div class="col-4">
            <div class="card p-fluid">
              <div class="field">
                <label for="name">Primary Image</label>
                <FileUpload
                    name="demo[]"
                    @uploader="onUpload"
                    accept="image/*"
                    :maxFileSize="1000000"
                    customUpload
                    class="p-button-outlined"
                />
              </div>

              <div class="field">
                <label for="name">Additional Images</label>
                <FileUpload
                    name="demo[]"
                    @uploader="onUpload"
                    :multiple="true"
                    accept="image/*"
                    :maxFileSize="1000000"
                    customUpload
                    class="p-button-outlined"
                />
              </div>

              <div class="field col">
                <label for="category_id" class="mb-3">Category</label>
                <Field name="category_id" v-slot="{ field }">
                  <Dropdown
                      v-bind="field"
                      id="category_id"
                      v-model="product.category_id"
                      :options="categories"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select a Category"
                      display="chip"
                      :class="{ 'p-invalid': errors.category_id }"
                      aria-describedby="product-category-id-error">
                  </Dropdown>
                </Field>
                <small class="p-error" id="product-category-id-error">{{errors.category_id || "&nbsp;"}}</small>
              </div>
              <div class="field col">
                <label for="sub_category_id" class="mb-3">Sub-category</label>
                <Field name="sub_category_id" v-slot="{ field }">
                  <Dropdown
                      v-bind="field"
                      id="sub_category_id"
                      v-model="product.sub_category_id"
                      :options="sub_categories"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select a Sub Category"
                      display="chip"
                      :class="{ 'p-invalid': errors.sub_category_id }"
                      aria-describedby="product-sub-category-id-error"
                  >
                  </Dropdown>
                </Field>
                <small class="p-error" id="product-sub-category-id-error">{{errors.sub_category_id || "&nbsp;"}}</small>
              </div>

              <div class="field col">
                <label for="fabric_id" class="mb-3">Fabric</label>
                <Field name="fabric_id" v-slot="{ field }">
                  <Dropdown
                      v-bind="field"
                      id="fabric_id"
                      v-model="product.fabric_id"
                      :options="fabrics"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select a Fabric"
                      display="chip"
                      :class="{ 'p-invalid': errors.fabric_id }"
                      aria-describedby="product-fabric-id-error">
                  </Dropdown>
                </Field>
                <small class="p-error" id="product-fabric-id-error">{{errors.fabric_id || "&nbsp;"}}</small>

              </div>

              <div class="field col">
                <label for="brand_id" class="mb-3">Brand</label>
                <Field name="brand_id" v-slot="{ field }">
                  <Dropdown
                      v-bind="field"
                      id="brand_id"
                      v-model="product.brand_id"
                      :options="brands"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select a Brand"
                      display="chip"
                      :class="{ 'p-invalid': errors.brand_id }"
                      aria-describedby="product-brand-id-error"
                  >
                  </Dropdown>
                </Field>
                <small class="p-error" id="product-brand-id-error">{{errors.brand_id || "&nbsp;"}}</small>
              </div>

              <div class="field col">
                <div class="formgrid grid">
                  <div class="field col">
                    <label for="name" class="flex mb-3">Default Printing</label>
                    <InputSwitch v-model="product.default_printing" />
                  </div>
                  <div class="field col">
                    <label for="name" class="flex mb-3">Default Embroidery</label>
                    <InputSwitch v-model="product.default_embroidery" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="card">
              <div class="field">
                <div
                    class="formgrid"
                    style="border: 1px solid #e4e4e4;border-radius: 12px;padding: 16px;">
                  <div>
                      <FieldArray name="size_charts" v-slot="{ fields, push, remove }">
                        <div class="flex justify-content-between flex-column sm:flex-row mb-3">
                          <h4>Size Chart</h4>
                          <div>
                            <Button
                                label="Add"
                                icon="pi pi-plus"
                                class="mr-2 mb-2"
                                @click="push({ size_id: '', width: '', length: ''})"
                            ></Button>
                          </div>
                        </div>
                        <table style="width: 100%; text-align: left">
                          <thead>
                          <tr>
                            <th>Sizes</th>
                            <th>Width</th>
                            <th>Length</th>
                            <th>Remove</th>
                            <th>Up/Down</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr  v-for="(field, idx) in fields" :key="idx">
                            <td>
                              <div class="flex flex-column gap-2 mb-2">
                                <Field :id="`size_id_${idx}`" :name="`size_charts[${idx}].size_id`" as="select" class="p-dropdown p-component p-inputwrapper p-inputwrapper-filled" style="padding: 0.75rem 0.75rem !important;" v-slot="{ field }">
                                  <option class="p-dropdown-label p-inputtext p-placeholder" :value="''">Select a size</option>
                                  <option class="p-dropdown-label p-inputtext p-placeholder" v-for="(size, index) in sizes" :value="size.id" :key="index">{{ size.name}}</option>
                                </Field>
                                <ErrorMessage class="p-error" :name="`size_charts[${idx}].size_id`"/>
                              </div>
                            </td>
                            <td>
                              <div class="flex flex-column gap-2 mb-2">
                                <Field :id="`width_${idx}`" :name="`size_charts[${idx}].width`" v-slot="{ field }">
                                  <input v-bind="field" class="p-inputtext p-component" type="text"
                                         v-model="field.value"
                                         :class="{ 'p-invalid': errors[`size_charts[${idx}].width`] }"
                                         placeholder="Enter width"/>
                                </Field>
                                <ErrorMessage class="p-error" :name="`size_charts[${idx}].width`"/>
                              </div>
                            </td>
                            <td>
                              <div class="flex flex-column gap-2 mb-2">
                                <Field :id="`length_${idx}`" :name="`size_charts[${idx}].length`" v-slot="{ field }">
                                  <input v-bind="field" class="p-inputtext p-component" type="text"
                                         v-model="field.value"
                                         :class="{ 'p-invalid': errors[`size_charts[${idx}].length`] }"
                                         placeholder="Enter length"/>
                                </Field>
                                <ErrorMessage class="p-error" :name="`size_charts[${idx}].length`"/>
                              </div>
                            </td>
                            <td>
                              <div class="flex flex-column gap-2 mb-2">
                                <Button v-if="values.size_charts.length > 1" @click="remove(idx)" icon="pi pi-times" class="p-button-rounded p-button-text mr-2 mb-2"/>
                              </div>
                            </td>
                            <td>
                              <div class="flex flex-column gap-2 mb-2">
                                <Button
                                    icon="pi pi-sort-alt"
                                    class="p-button-rounded p-button-text mr-2 mb-2"
                                />
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </FieldArray>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="card">
                <FieldArray name="price_shirt_charts" v-slot="{ fields, push, remove }">
                  <div class="flex justify-content-between flex-column sm:flex-row mb-3">
                    <h4>Price Shirt Chart</h4>
                    <div>
                      <Button
                          label="Add"
                          icon="pi pi-plus"
                          class="mr-2 mb-2"
                          @click="push({ price_category_id: '', range_from: '', range_to: '', price: ''})"
                      ></Button>
                    </div>
                  </div>
                  <div class="field">
                    <div
                        class="formgrid"
                        style="border: 1px solid #e4e4e4;border-radius: 12px;padding: 16px;">
                      <table style="width: 100%; text-align: left">
                        <thead>
                        <tr>
                          <th>Price Category</th>
                          <th>Range From</th>
                          <th>Range To</th>
                          <th>Price</th>
                          <th>Remove</th>
                          <th class="text-center">Up/Down</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr  v-for="(field, idx) in fields" :key="idx">
                          <td>
                            <div class="flex flex-column gap-2 mb-2">
                              <Field :id="`price_category_id_${idx}`" :name="`price_shirt_charts[${idx}].price_category_id`" as="select" class="p-dropdown p-component p-inputwrapper p-inputwrapper-filled" style="padding: 0.75rem 0.75rem !important;" v-slot="{ field }">
                                <option class="p-dropdown-label p-inputtext p-placeholder" :value="''">Select a price category</option>
                                <option class="p-dropdown-label p-inputtext p-placeholder" v-for="(price_category, index) in price_categories" :value="price_category.id" :key="index">{{ price_category.name}}</option>
                              </Field>
                              <ErrorMessage class="p-error" :name="`price_shirt_charts[${idx}].price_category_id`"/>
                            </div>

                          </td>
                          <td>
                            <div class="flex flex-column gap-2 mb-2">
                              <Field :id="`range_from_${idx}`" :name="`price_shirt_charts[${idx}].range_from`" v-slot="{ field }">
                                <input v-bind="field" class="p-inputtext p-component" type="text" v-model="field.value"
                                       :class="{ 'p-invalid': errors[`price_shirt_charts[${idx}].range_from`] }"
                                       placeholder="Enter range from"/>
                              </Field>
                              <ErrorMessage class="p-error" :name="`price_shirt_charts[${idx}].range_from`"/>
                            </div>
                          </td>
                          <td>
                            <div class="flex flex-column gap-2 mb-2">
                              <Field :id="`range_to_${idx}`" :name="`price_shirt_charts[${idx}].range_to`" v-slot="{ field }">
                                <input v-bind="field" class="p-inputtext p-component" type="text" v-model="field.value"
                                       :class="{ 'p-invalid': errors[`price_shirt_charts[${idx}].range_to`] }"
                                       placeholder="Enter range to"/>
                              </Field>
                              <ErrorMessage class="p-error" :name="`price_shirt_charts[${idx}].range_to`"/>
                            </div>
                          </td>
                          <td>
                            <div class="flex flex-column gap-2 mb-2">
                              <Field :id="`price_${idx}`" :name="`price_shirt_charts[${idx}].price`" v-slot="{ field }">
                                <input v-bind="field" class="p-inputtext p-component" type="text" v-model="field.value"
                                       :class="{ 'p-invalid': errors[`price_shirt_charts[${idx}].price`] }"
                                       placeholder="Enter price"/>
                              </Field>
                              <ErrorMessage class="p-error" :name="`price_shirt_charts[${idx}].price`"/>
                            </div>
                          </td>
                          <td>
                            <div class="flex flex-column gap-2 mb-2">
                              <Button v-if="values.price_shirt_charts.length > 1" @click="remove(idx)" icon="pi pi-times" class="p-button-rounded p-button-text mr-2 mb-2"/>
                            </div>
                          </td>
                          <td>
                            <div class="flex flex-column gap-2 mb-2">
                              <Button
                                  icon="pi pi-sort-alt"
                                  class="p-button-rounded p-button-text mr-2 mb-2"
                              />
                            </div>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </FieldArray>
              <div class="field">
                <div
                    class="formgrid"
                    style="
                    border: 1px solid #e4e4e4;
                    border-radius: 12px;
                    padding: 16px;
                  "
                >
                  <div>
                    <div
                        class="flex justify-content-between flex-column sm:flex-row mb-3"
                    >
                      <div>
                        <h4 class="mb-0">Select and add picture for print area</h4>
                      </div>
                    </div>
                    <div class="grid p-fluid">
                      <div class="col-12 md:col-12">
                        <div class="grid p-fluid text-center">
                          <div class="col-12 md:col-3">
                            <div class="card">
                              <h5 class="mb-4">Front Side</h5>
                              <div class="mb-3">
                                <img
                                    src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                                    alt=""
                                    height="100"
                                />
                              </div>
                              <div class="flex justify-content-center gap-3">
                                <div class="field-checkbox mb-0">
                                  <Checkbox
                                      id="checkOption1"
                                      name="option"
                                      value="Chicago"
                                  />
                                </div>
                                <FileUpload
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
                                <img
                                    src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                                    alt=""
                                    height="100"
                                />
                              </div>
                              <div class="flex justify-content-center gap-3">
                                <div class="field-checkbox mb-0">
                                  <Checkbox
                                      id="checkOption1"
                                      name="option"
                                      value="Chicago"
                                  />
                                </div>
                                <FileUpload
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
                                <img
                                    src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                                    alt=""
                                    height="100"
                                />
                              </div>
                              <div class="flex justify-content-center gap-3">
                                <div class="field-checkbox mb-0">
                                  <Checkbox
                                      id="checkOption1"
                                      name="option"
                                      value="Chicago"
                                  />
                                </div>
                                <FileUpload
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
                                <img
                                    src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                                    alt=""
                                    height="100"
                                />
                              </div>
                              <div class="flex justify-content-center gap-3">
                                <div class="field-checkbox mb-0">
                                  <Checkbox
                                      id="checkOption1"
                                      name="option"
                                      value="Chicago"
                                  />
                                </div>
                                <FileUpload
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
                  </div>
                </div>
              </div>
              <div class="field">
                <div
                    class="formgrid"
                    style="
                    border: 1px solid #e4e4e4;
                    border-radius: 12px;
                    padding: 16px;
                  "
                >
                  <div>
                    <ClothCustom />
                  </div>
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
      <div class="flex justify-content-center">
      <ProgressSpinner v-if="spinner" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
