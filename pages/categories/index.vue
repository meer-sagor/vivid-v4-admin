<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref,nextTick,watch, computed } from "vue";
import {Field, Form, useField, useForm} from 'vee-validate';
import * as Yup from "yup";
const {handleSubmit, resetForm} = useForm();
const fetching = ref(false);
const spinner = ref(false);
//filters
const { $dateFilter } = useNuxtApp();
const schema = Yup.object().shape({
  name: Yup.string().required().min(2).max(50).label("This"),
  order: Yup.number().typeError('Order is number field').required().label("Order Reqired"),
  type: Yup.mixed().required().label("Type"),
  status: Yup.mixed().required().label("status"),
});
const imageError = ref(null);
// const resetModal = () => {
//   const resetForm = document.getElementById(
//     "add_promo_code_form"
//   ) as HTMLFormElement;
//   if (resetForm) {
//     resetForm.reset();
//   }
// };
const toast = useToast();
const products = ref(null);
const search = ref(null);
const status = ref(null);
const type = ref(null);
const fileInput = ref(null);
const files = ref();
const fileData = ref();
const categories = ref([]);
const rowsPerPage = ref(0)
const totalRecords = ref(0)
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
  { label: "Enable", value: "ENABLE" },
  { label: "Disable", value: "DISABLE" },
]);
const types = ref([
  { label: "Product", value: "product" },
  { label: "Product Design", value: "product_design" },
  { label: "Embroidery Design", value: "embroidery_design" },
  { label: "Clipart", value: "clipart" },
]);
const onPhotoSelect = ($event) => {
  product.value.image_id == null
  files.value = fileInput.value?.files;
  imageError.value = null;
  console.log(files.value[0].objectURL);
};
// wathcer 
watch(search, (newValue, oldValue) => {
  initialize();
});
// Computed
const searchTerm = computed(() => {
  return search.value ? '&name=' + search.value : ''
})
const statusTerm = computed(() => {
  if (status.value){
    return  '&status=' + status.value.value
  }else{
    return ''
  }
})
const typeTerm = computed(() => {
  // console.log(status.value,'status');
  if (type.value){
    return  '&type=' + type.value.value
  }else{
    return ''
  }
})
onMounted( async () => {
  await nextTick();
  await initialize();
});
const initialize = async (event) => {
  spinner.value = true
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/categories/?page=" + page + searchTerm.value + statusTerm.value + typeTerm.value, {
    method: "GET",
  });
  spinner.value = false
  // errorMessage.value = null;
  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something Went worng",
      life: 3000,
    });
  }
  if (data.value) {
    //   console.log(data.value.brands);
    fetching.value = true
    categories.value = data.value.categories.data;
    rowsPerPage.value = data.value.categories.per_page
    totalRecords.value = data.value.categories.total
    //   totalData.value  = data.value.roles.total
  }
};
const formatCurrency = (value) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const openNew = () => {
  product.value = {};
  product.value.status = "ENABLE";
  submitted.value = false;
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

const saveProduct = async () => {
  if (product.value.image_id == null && product.value.image_id == undefined) {
    if(files.value){
      await uploadHandler();
    }
    else{
      imageError.value = "This Feild is required";
    }
  }
  submitted.value = true;
  console.log(product.value);
  if (product.value.name && product.value.name.trim() && product.value.image_id) {
    product.value.status = product.value.status.value
      ? product.value.status.value
      : product.value.status;
      product.value.type = product.value.type.value
      ? product.value.type.value.toUpperCase()
      : product.value.type.toUpperCase();
    if (product.value.id) {
      if (product.value.media == null) {
        await uploadHandler();
      }
      product.value.status = product.value.status.toUpperCase()
      // product.value.status = product.value.status.value ? product.value.status.value : product.value.status;
      const { data, error } = await useApiFetch(
        "/api/categories/" + product.value.id,
        {
          method: "PUT",
          body: product.value,
        }
      );
      // errorMessage.value = null;
      if (error.value) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Something Went worng",
          life: 3000,
        });
      }
      if (data.value) {
        imageError.value = null; 
        toast.add({
          severity: "info",
          summary: "Success",
          detail: data.value.message,
          life: 3000,
        });
      }
      categories.value[findIndexById(product.value.id)] = product.value;
      await initialize();
      // toast.add({
      //     severity: 'success',
      //     summary: 'Successful',
      //     detail: 'Product Updated',
      //     life: 3000
      // });
    } else {
      const { data, error } = await useApiFetch("/api/categories", {
        method: "POST",
        body: product.value,
      });
      if (error.value) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Something Went worng",
          life: 3000,
        });
      }
      if (data.value) {
        imageError.value = null;
        toast.add({
          severity: "info",
          summary: "Success",
          detail: data.value.message,
          life: 3000,
        });
      }
      await initialize();
      // product.value.id = createId();
      // product.value.code = createId();
      // product.value.image = 'product-placeholder.svg';
      // product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'Enable';
      // products.value.push(product.value);
      // toast.add({
      //     severity: 'success',
      //     summary: 'Successful',
      //     detail: 'Product Created',
      //     life: 3000
      // });
    }

    productDialog.value = false;
    product.value = {};
  }
};
const uploadHandler = async () => {
  console.log( files.value );
  // uploading.value = true;
  const fileUp = files.value[0];
  const body = new FormData();
  body.append("image", fileUp);
  body.append("type", "CATEGORY");

  const { data } = await useApiFetch("/api/image", {
    method: "POST",
    body: body,
  });
  // console.log(data);
  if (data.value) {
    product.value.image_id = data.value.media.id
    imageError.value = null;
    // await auth.fetchUser();
    // uploading.value = false;
    // toast.add({
    //   severity: "info",
    //   summary: "Success",
    //   detail: "File Uploaded",
    //   life: 3000,
    // });
  }
};
const editProduct = (editProduct) => {
  product.value = { ...editProduct };
  console.log(product.value.status);
  product.value.status = product.value.status.toUpperCase()
  productDialog.value = true;
  files.value = null;
  if (product.value.media) {
    fileData.value =  product.value.media.url
  }
};

const confirmDeleteProduct = (editProduct) => {
  product.value = editProduct;
  deleteProductDialog.value = true;
};

const deleteProduct = async () => {
  const { data, error } = await useApiFetch("/api/categories/" + product.value.id, {
    method: "DELETE",
  });
  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something Went worng",
      life: 3000,
    });
  }
  if (data.value) {
    toast.add({
      severity: "success",
      summary: "Product Deleted",
      detail: data.value.message,
      life: 3000,
    });
    categories.value = categories.value.filter((val) => val.id !== product.value.id);
    product.value = {};
  }
  deleteProductDialog.value = false;
};

const findIndexById = (id) => {
  let index = -1;

  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
};

const createId = () => {
  let id = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
  products.value = products.value.filter(
    (val) => !selectedProducts.value.includes(val)
  );
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Products Deleted",
    life: 3000,
  });
};

const onUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};
</script>

<template>
  <div class="grid">
    <div class="col-12" v-if="fetching">
      <div class="card">
        <Toast />
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="categories"
          :lazy="true"
          dataKey="id"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          @page="initialize"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Total {totalRecords} brands"
          responsiveLayout="scroll"
        >
          <template #paginatorstart>
            <Button
              type="button"
              icon="pi pi-refresh"
              text
              @click="initialize"
            />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h3 class="m-0">Categories</h3>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"
              >
                <div class="flex gap-2 md:align-items-center">
                  <label for="inventoryStatus" class="mb-0">Type</label>
                  <Dropdown
                    id="inventoryStatus"
                    v-model="type"
                    :options="types"
                    optionLabel="label"
                    placeholder="Select a Type"
                    @change="initialize"
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value && slotProps.value.value">
                        <span
                          :class="
                            'product-badge status-' + slotProps.value.value
                          "
                          >{{ slotProps.value.label }}</span
                        >
                      </div>
                      <div
                        v-else-if="slotProps.value && !slotProps.value.value"
                      >
                        <span
                          :class="
                            'product-badge status-' +
                            slotProps.value.toLowerCase()
                          "
                          >{{ slotProps.value }}</span
                        >
                      </div>
                      <span v-else>
                        {{ slotProps.placeholder }}
                      </span>
                    </template>
                  </Dropdown>
                </div>
                <div class="flex gap-2 md:align-items-center">
                  <label for="inventoryStatus" class="mb-0">Status</label>
                  <Dropdown
                    id="inventoryStatus"
                    v-model="status"
                    :options="statuses"
                    optionLabel="label"
                    placeholder="Select a Status"
                    @change="initialize"
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value && slotProps.value.value">
                        <span
                          :class="
                            'product-badge status-' + slotProps.value.value
                          "
                          >{{ slotProps.value.label }}</span
                        >
                      </div>
                      <div
                        v-else-if="slotProps.value && !slotProps.value.value"
                      >
                        <span
                          :class="
                            'product-badge status-' +
                            slotProps.value.toLowerCase()
                          "
                          >{{ slotProps.value }}</span
                        >
                      </div>
                      <span v-else>
                        {{ slotProps.placeholder }}
                      </span>
                    </template>
                  </Dropdown>
                </div>
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="search"
                    placeholder="Search..."
                  />
                </span>
                <Button
                  label="New"
                  icon="pi pi-plus"
                  class="p-button-primary mr-2"
                  @click="openNew"
                />
              </div>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="order"
            header="Order"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Order</span>
              {{ slotProps.data.order }}
            </template>
          </Column>
          <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="description" header="Description" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Description</span>
              {{ slotProps.data.description }}
            </template>
          </Column>
          <Column header="Image" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Image</span>
              <img
                v-if="slotProps.data.media"
                :src="slotProps.data.media.url"
                :alt="slotProps.data.media.url"
                class="shadow-2"
                width="100"
              />
            </template>
          </Column>
          <Column field="description" header="Type" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Type</span>
              {{ slotProps.data.type }}
            </template>
          </Column>
          <Column field="inventoryStatus" header="Status" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              <span
                :class="
                  'product-badge status-' +
                  (slotProps.data.status
                    ? slotProps.data.status.toLowerCase()
                    : '')
                "
                >{{ slotProps.data.status }}</span
              >
            </template>
          </Column>
          <Column field="created_at" header="Created at" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Created at</span>
              {{  $dateFilter(slotProps.data.created_at)  }}
            </template>
          </Column>
          <Column class="text-right">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text mr-2"
                @click="editProduct(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                class="p-button-rounded p-button-text mt-2"
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="Edit Details"
          :modal="true"
          class="p-fluid"
        >
          <Form id="add_role_form" @submit="saveProduct"  :initial-values="product" :validation-schema="schema" v-slot="{ errors }">
            <div class="field">
              <label for="name">Order</label>
              <Field v-model="product.order" id="order" name="order" :class="{ 'p-invalid': errors.order }" class="p-inputtext p-component" aria-describedby="category-order-error" placeholder="Category Order"/>
              <small class="p-error" id="category-order-error">{{ errors.order || '&nbsp;' }}</small>
            </div>

            <div class="field">
              <label for="description">Name</label>
              <Field v-model="product.name" id="name" name="name" :class="{ 'p-invalid': errors.name }" class="p-inputtext p-component" aria-describedby="category-name-error" placeholder="Category name"/>
              <small class="p-error" id="category-name-error">{{ errors.name || '&nbsp;' }}</small>
            </div>

            <div class="field">
              <label for="description">Description</label>
              <Textarea
                id="description"
                v-model="product.description"
                required="true"
                rows="3"
                cols="20"
              />
            </div>

            <div class="field">
              <label for="name">Image</label>
              <FileUpload ref="fileInput" mode="basic" name="demo[]" url="/api/upload" accept="image/*" customUpload @select="onPhotoSelect($event)" />
              <span class="p-invalid" v-if="imageError">{{ imageError }}</span>
              <br>
              <img
                v-if="files"
                :src="files[0].objectURL"
                :alt="files[0].objectURL"
                class="shadow-2"
                width="100"
                height="50"
              />
              <img
                v-else-if="fileData"
                :src="fileData"
                :alt="fileData"
                class="shadow-2"
                width="100"
                height="50"
              />
            </div>

            <div class="field">
              <label for="Types">Types</label>
              <Field name="type" v-slot="{ field }">
                <Dropdown
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
              <label for="inventoryStatus" class="mb-3">Status</label>
              <Field name="status" v-slot="{ field }">
                <Dropdown
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
                class="" type="submit" label="Submit"
                icon="pi pi-check"
              />
            <!-- </template> -->
          </Form>
        </Dialog>

        <Dialog
          v-model:visible="deleteProductDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="product"
              >Are you sure you want to delete <b>{{ product.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteProductDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteProduct"
            />
          </template>
        </Dialog>
      </div>
    </div>
    <div class="col-12">
      <div class="flex justify-content-center">
        <ProgressSpinner v-if="spinner"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
