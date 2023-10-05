<!--<script setup>-->
<!--import { ProductService } from "@/service/ProductService";-->
<!--import { FilterMatchMode } from "primevue/api";-->
<!--import { useToast } from "primevue/usetoast";-->
<!--import {nextTick, onMounted, ref} from "vue";-->
<!--import {ErrorMessage, Field, FieldArray, Form} from 'vee-validate';-->
<!--import * as Yup from "yup";-->
<!--import {useApiFetch} from "~/composables/useApiFetch";-->

<!--const description = ref(null);-->
<!--const chartDescription = ref(null);-->

<!--const editorValue = ref(description, chartDescription);-->
<!--function resetText() {-->
<!--  editorValue.value = startText;-->
<!--}-->

<!--const toast = useToast();-->

<!--const products = ref(null);-->

<!--const productDialog = ref(false);-->
<!--const deleteProductDialog = ref(false);-->
<!--const deleteProductsDialog = ref(false);-->
<!--const product = ref({});-->
<!--const selectedProducts = ref(null);-->
<!--const dt = ref(null);-->
<!--const defaultPrinting = ref(false);-->
<!--const defaultEmbroidery = ref(false);-->
<!--const filters = ref({-->
<!--  global: { value: null, matchMode: FilterMatchMode.CONTAINS },-->
<!--});-->

<!--const submitted = ref(false);-->
<!--const statuses = ref([-->
<!--  { label: "Enable", value: "enable" },-->
<!--  { label: "Disable", value: "disable" },-->
<!--]);-->

<!--const categories = ref([-->
<!--  { label: "T Shirt", value: "tshirt" },-->
<!--  { label: "Disable", value: "disable" },-->
<!--]);-->

<!--onMounted(async() => {-->
<!--  await nextTick();-->
<!--  await fetchSizes()-->
<!--  ProductService.getProducts().then((data) => (products.value = data));-->
<!--});-->

<!--const formatCurrency = (value) => {-->
<!--  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });-->
<!--};-->

<!--const openNew = () => {-->
<!--  product.value = {};-->
<!--  submitted.value = false;-->
<!--  productDialog.value = true;-->
<!--};-->

<!--const handleChange = (value) => {-->
<!--  description = value;-->
<!--};-->

<!--const hideDialog = () => {-->
<!--  productDialog.value = false;-->
<!--  submitted.value = false;-->
<!--};-->

<!--const saveProduct = () => {-->
<!--  submitted.value = true;-->

<!--  if (product.value.name && product.value.name.trim() && product.value.price) {-->
<!--    if (product.value.id) {-->
<!--      product.value.inventoryStatus = product.value.inventoryStatus.value-->
<!--        ? product.value.inventoryStatus.value-->
<!--        : product.value.inventoryStatus;-->
<!--      products.value[findIndexById(product.value.id)] = product.value;-->
<!--      toast.add({-->
<!--        severity: "success",-->
<!--        summary: "Successful",-->
<!--        detail: "Product Updated",-->
<!--        life: 3000,-->
<!--      });-->
<!--    } else {-->
<!--      product.value.id = createId();-->
<!--      product.value.code = createId();-->
<!--      product.value.image = "product-placeholder.svg";-->
<!--      product.value.inventoryStatus = product.value.inventoryStatus-->
<!--        ? product.value.inventoryStatus.value-->
<!--        : "Enable";-->
<!--      products.value.push(product.value);-->
<!--      toast.add({-->
<!--        severity: "success",-->
<!--        summary: "Successful",-->
<!--        detail: "Product Created",-->
<!--        life: 3000,-->
<!--      });-->
<!--    }-->

<!--    productDialog.value = false;-->
<!--    product.value = {};-->
<!--  }-->
<!--};-->

<!--const editProduct = (editProduct) => {-->
<!--  product.value = { ...editProduct };-->
<!--  console.log(product);-->
<!--  productDialog.value = true;-->
<!--};-->

<!--const confirmDeleteProduct = (editProduct) => {-->
<!--  product.value = editProduct;-->
<!--  deleteProductDialog.value = true;-->
<!--};-->

<!--const deleteProduct = () => {-->
<!--  products.value = products.value.filter((val) => val.id !== product.value.id);-->
<!--  deleteProductDialog.value = false;-->
<!--  product.value = {};-->
<!--  toast.add({-->
<!--    severity: "success",-->
<!--    summary: "Successful",-->
<!--    detail: "Product Deleted",-->
<!--    life: 3000,-->
<!--  });-->
<!--};-->

<!--const findIndexById = (id) => {-->
<!--  let index = -1;-->

<!--  for (let i = 0; i < products.value.length; i++) {-->
<!--    if (products.value[i].id === id) {-->
<!--      index = i;-->
<!--      break;-->
<!--    }-->
<!--  }-->

<!--  return index;-->
<!--};-->

<!--const createId = () => {-->
<!--  let id = "";-->
<!--  const chars =-->
<!--    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";-->

<!--  for (let i = 0; i < 5; i++) {-->
<!--    id += chars.charAt(Math.floor(Math.random() * chars.length));-->
<!--  }-->

<!--  return id;-->
<!--};-->

<!--const onUpload = () => {-->
<!--  toast.add({-->
<!--    severity: "info",-->
<!--    summary: "Success",-->
<!--    detail: "File Uploaded",-->
<!--    life: 3000,-->
<!--  });-->
<!--};-->

<!--const sizes = ref([])-->
<!--const fetchSizes = async () => {-->
<!--  const {data, error} = await useApiFetch("/api/price-category/codes", {-->
<!--    method: "GET",-->
<!--  });-->
<!--  if (data.value) {-->
<!--    const getSizes = JSON.parse(JSON.stringify(computed(() => data.value).value));-->
<!--    sizes.value = getSizes.sizes;-->
<!--  }-->
<!--};-->

<!--const size_chart_from_data = ref({-->
<!--  size_charts: [{-->
<!--    size_id: '',-->
<!--    width: '',-->
<!--    length: '',-->
<!--  }],-->
<!--})-->


<!--const sizeChartsValidationSchema = Yup.object().shape({-->
<!--  size_charts: Yup-->
<!--          .array()-->
<!--          .of(-->
<!--              Yup.object().shape({-->
<!--                    size_id: Yup.string().typeError('Size is a required field').required().label("Size"),-->
<!--                    width: Yup.number().typeError('Width must be a number type').moreThan(0, "Width cannot be negative").max(1000).min(0).required().label("Width"),-->
<!--                    length: Yup.number().typeError('Length must be a number type').moreThan(0, "Length cannot be negative").max(1000).min(0).required().label("Length"),-->
<!--                  },-->
<!--              )-->
<!--          ),-->
<!--    }-->
<!--);-->


<!--const price_shirt_chart_from_data = ref({-->
<!--  price_shirt_charts: [{-->
<!--    sizes: '',-->
<!--    range_from: '',-->
<!--    range_to: '',-->
<!--    price: '',-->
<!--  }],-->
<!--})-->
<!--const priceShirtChartsValidationSchema = Yup.object().shape({-->
<!--  price_shirt_charts: Yup-->
<!--          .array()-->
<!--          .of(-->
<!--              Yup.object().shape({-->
<!--                    sizes: Yup.string().typeError('Sizes is a required field').required().label("Sizes"),-->
<!--                    range_from: Yup.number().typeError('Range from must be a number type').moreThan(0, "Range from cannot be negative").max(1000).min(0).required().label("Range from"),-->
<!--                    range_to: Yup.number().typeError('Range to must be a number type').moreThan(0, "Range to cannot be negative").max(1000).min(0).required().label("Range to"),-->
<!--                    price: Yup.number().typeError('Price must be a number type').moreThan(0, "Price cannot be negative").max(1000).min(0).required().label("Price"),-->
<!--                  },-->
<!--                  [-->
<!--                    ['sizes', 'range_from', 'range_to', 'price'],-->
<!--                  ]-->
<!--              )-->
<!--          ),-->
<!--    }-->
<!--);-->

<!--</script>-->

<script lang="ts">
import { useToast } from "primevue/usetoast";
import { defineComponent, nextTick, onMounted, ref} from "vue";
import {ErrorMessage, Field, FieldArray, Form} from 'vee-validate';
import * as Yup from "yup";
import {useApiFetch} from "~/composables/useApiFetch";

export default defineComponent({
  components: {Form, Field, ErrorMessage, FieldArray},
  setup() {
    const toast = useToast();
    const products = ref(null);
    const product = ref({});
    const submitted = ref(false);
    const defaultPrinting = ref(false);
    const defaultEmbroidery = ref(false);
    const statuses = ref([]);
    const categories = ref([]);
    const sub_categories = ref([])
    const fabrics = ref([])
    const brands = ref([])
    const price_categories = ref([])
    const sizes = ref([])

    onMounted(async() => {
      await nextTick();
      await fetchSizes()
    });

    const onUpload = () => {
      console.log('image')
    }

    const description = ref('')
    const chartDescription = ref('')
    const handleChange = (value: any) => {
      description.value = value;
    }

    const saveProduct = () => {
      submitted.value = true;
    };

    const fetchSizes = async () => {
      const {data, error} = await useApiFetch("/api/product/codes", {
        method: "GET",
      });
      if (data.value) {
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

    const size_chart_from_data = ref({
      size_charts: [{
        size_id: '',
        width: '',
        length: '',
      }],
    })

    const sizeChartsValidationSchema = Yup.object().shape({
          size_charts: Yup
              .array()
              .of(
                  Yup.object().shape({
                        size_id: Yup.mixed().typeError('Size is a required field').required().label("Size"),
                        width: Yup.number().typeError('Width must be a number type').moreThan(0, "Width cannot be negative").max(1000).min(0).required().label("Width"),
                        length: Yup.number().typeError('Length must be a number type').moreThan(0, "Length cannot be negative").max(1000).min(0).required().label("Length"),
                      },
                  )
              ),
        }
    );
    const price_shirt_chart_from_data = ref({
      price_shirt_charts: [{
        sizes: '',
        range_from: '',
        range_to: '',
        price: '',
      }],
    })
    const priceShirtChartsValidationSchema = Yup.object().shape({
          price_shirt_charts: Yup
              .array()
              .of(
                  Yup.object().shape({
                        sizes: Yup.string().typeError('Sizes is a required field').required().label("Sizes"),
                        range_from: Yup.number().typeError('Range from must be a number type').moreThan(0, "Range from cannot be negative").max(1000).min(0).required().label("Range from"),
                        range_to: Yup.number().typeError('Range to must be a number type').moreThan(0, "Range to cannot be negative").max(1000).min(0).required().label("Range to"),
                        price: Yup.number().typeError('Price must be a number type').moreThan(0, "Price cannot be negative").max(1000).min(0).required().label("Price"),
                      }
                  )
              ),
        }
    );

    return {
      toast,
      sizes,defaultPrinting,
      defaultEmbroidery,fetchSizes,size_chart_from_data,sizeChartsValidationSchema,price_shirt_chart_from_data,
      priceShirtChartsValidationSchema,
      product,products,submitted,statuses,categories, sub_categories, onUpload, saveProduct, handleChange, chartDescription, description}
  }
})
</script>

<template>
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

  <div class="grid">
    <div class="col-8">
      <div class="card p-fluid">
        <h5>Create Product</h5>
        <div class="field mt-4">
          <label for="name">Name</label>
          <InputText
              id="name"
              v-model.trim="product.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
          />
          <small v-if="submitted && !product.name" class="p-invalid">Name is required.</small>
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <label for="inventoryStatus" class="mb-3">URL Key</label>
            <InputText
                id="name"
                v-model.trim="product.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid">Name is required.</small>
          </div>
          <div class="field col">
            <label for="name" class="mb-3">Style Number</label>
            <InputText
                id="name"
                v-model.trim="product.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid">Name is required.</small>
          </div>
        </div>

        <div class="formgrid grid md:align-items-center">
          <div class="field col">
            <label for="name" class="mb-3">SKU</label>
            <InputText
                id="name"
                v-model.trim="product.name"
                autofocus
                :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid">Name is required.</small>
          </div>
          <div class="field col">
            <label for="name" class="mb-3">Quantity</label>
            <InputText
                id="name"
                type="number"
                value="0"
                v-model.trim="product.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid">Name is required.</small>
          </div>
        </div>

        <div class="field">
          <label for="name" class="mb-3">Description</label>
          <ClientOnly>
            <QuillEditor
                ref="editor"
                v-model.content="description"
                theme="snow"
                content-type="html"
                :style="{ height: '200px' }"
                @update:content="handleChange"
            />
          </ClientOnly>
        </div>

        <div class="field">
          <label for="name" class="mb-3">Size Chart Description</label>
          <ClientOnly>
            <QuillEditor
                ref="editor"
                v-model.content="chartDescription"
                theme="snow"
                content-type="html"
                :style="{ height: '200px' }"
                @update:content="handleChange"
            />
          </ClientOnly>
        </div>

        <div class="field">
          <label for="inventoryStatus" class="mb-3">Status</label>
          <Dropdown
              id="inventoryStatus"
              v-model="product.inventoryStatus"
              :options="statuses"
              optionLabel="label"
              placeholder="Select a Status"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Dropdown>
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
          <label for="categories" class="mb-3">Category</label>
          <Dropdown
              id="categories"
              v-model="product.categories"
              :options="categories"
              optionLabel="label"
              placeholder="Select a Category"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.toLowerCase() ">{{ slotProps.value }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <label for="Sub-category" class="mb-3">Sub-category</label>
          <Dropdown
              id="Sub-category"
              v-model="product.categories"
              :options="sub_categories"
              optionLabel="label"
              placeholder="Select a Category"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <label for="inventoryStatus" class="mb-3">Fabric</label>
          <Dropdown
              id="inventoryStatus"
              v-model="product.inventoryStatus"
              :options="statuses"
              optionLabel="label"
              placeholder="Select a Fabric">
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <label for="inventoryStatus" class="mb-3">Brand</label>
          <Dropdown
              id="inventoryStatus"
              v-model="product.inventoryStatus"
              :options="statuses"
              optionLabel="label"
              placeholder="Select a Brand"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <div class="formgrid grid">
            <div class="field col">
              <label for="name" class="flex mb-3">Default Printing</label>
              <InputSwitch v-model="defaultPrinting" />
            </div>
            <div class="field col">
              <label for="name" class="flex mb-3">Default Embroidery</label>
              <InputSwitch v-model="defaultEmbroidery" />
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
              <Form :initial-values="size_chart_from_data" :validation-schema="sizeChartsValidationSchema" v-slot="{values, errors }">
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
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <Form :initial-values="price_shirt_chart_from_data" :validation-schema="priceShirtChartsValidationSchema" v-slot="{values, errors }">
          <FieldArray name="price_shirt_charts" v-slot="{ fields, push, remove }">
            <div class="flex justify-content-between flex-column sm:flex-row mb-3">
              <h4>Price Shirt Chart</h4>
              <div>
                <Button
                    label="Add"
                    icon="pi pi-plus"
                    class="mr-2 mb-2"
                    @click="push({ sizes: '', range_from: '', range_to: '', price: ''})"
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
                    <th>Sizes</th>
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
                        <Field :id="`sizes_${idx}`" :name="`price_shirt_charts[${idx}].sizes`" v-slot="{ field }">
                          <input v-bind="field" class="p-inputtext p-component" type="text" v-model="values.price_shirt_charts[idx].sizes"
                                 :class="{ 'p-invalid': errors[`price_shirt_charts[${idx}].sizes`] }"
                                 placeholder="Enter sizes"/>
                        </Field>
                        <ErrorMessage class="p-error" :name="`price_shirt_charts[${idx}].sizes`"/>
                      </div>

                    </td>
                    <td>
                      <div class="flex flex-column gap-2 mb-2">
                        <Field :id="`range_from_${idx}`" :name="`price_shirt_charts[${idx}].range_from`" v-slot="{ field }">
                          <input v-bind="field" class="p-inputtext p-component" type="text" v-model="values.price_shirt_charts[idx].range_from"
                                 :class="{ 'p-invalid': errors[`price_shirt_charts[${idx}].range_from`] }"
                                 placeholder="Enter range from"/>
                        </Field>
                        <ErrorMessage class="p-error" :name="`price_shirt_charts[${idx}].range_from`"/>
                      </div>
                    </td>
                    <td>
                      <div class="flex flex-column gap-2 mb-2">
                        <Field :id="`range_to_${idx}`" :name="`price_shirt_charts[${idx}].range_to`" v-slot="{ field }">
                          <input v-bind="field" class="p-inputtext p-component" type="text" v-model="values.price_shirt_charts[idx].range_to"
                                 :class="{ 'p-invalid': errors[`price_shirt_charts[${idx}].range_to`] }"
                                 placeholder="Enter range to"/>
                        </Field>
                        <ErrorMessage class="p-error" :name="`price_shirt_charts[${idx}].range_to`"/>
                      </div>
                    </td>
                    <td>
                      <div class="flex flex-column gap-2 mb-2">
                        <Field :id="`price_${idx}`" :name="`price_shirt_charts[${idx}].price`" v-slot="{ field }">
                          <input v-bind="field" class="p-inputtext p-component" type="text" v-model="values.price_shirt_charts[idx].price"
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
        </Form>

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
          <Button style="min-width: 150px" label="Save" @click="saveProduct" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
