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
const schema = Yup.object({
  name: Yup.string().required().min(2).max(50).label("Name"),
  hex: Yup.string().required().min(2).max(50).label("Name"),
  colorFamily: Yup.mixed().required().label("Color Family"),
  status: Yup.mixed().required().label("status"),
});
const imageError = ref(null);
const toast = useToast();
//filters
const { $dateFilter } = useNuxtApp();
const products = ref(null);
const search = ref(null);
const fileInput = ref(null);
const files = ref();
const fileData = ref();
const colors = ref([]);
const colorFamilies = ref([]);
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

const onPhotoSelect = ($event) => {
  product.value.image_id == null
  imageError.value = null;
  files.value = fileInput.value?.files;
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
onMounted(async () => {
  // ProductService.getProducts().then((data) => (products.value = data));
  await nextTick();
  await initialize();
  await colorFamilyData();
});
const initialize = async (event) => {
  spinner.value = true
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/colors/?page=" + page + searchTerm.value, {
    method: "GET",
  });
  spinner.value = false
  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something Went worng",
      life: 3000,
    });
  }
  if (data.value) {
    fetching.value = true
    colors.value = data.value.colors.data;
    rowsPerPage.value = data.value.colors.per_page
    totalRecords.value = data.value.colors.total
    //   totalData.value  = data.value.roles.total
  }
};
const colorFamilyData = async () => {
  const { data, error } = await useApiFetch("/api/color-families/", {
    method: "GET",
  });
  if (data.value) {
    colorFamilies.value = data.value.color_families.data;
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

  if (product.value.name && product.value.name.trim()) {
    product.value.status = product.value.status.value
      ? product.value.status.value.toUpperCase()
      : product.value.status;
    if (product.value.id) {
      if (product.value.media == null) {
        await uploadHandler();
      }
      product.value.status = product.value.status.toUpperCase()
      console.log(product.value.status);
      const { data, error } = await useApiFetch(
        "/api/colors/" + product.value.id,
        {
          method: "PUT",
          body: product.value,
        }
      );
      // errorMessage.value = null;
      // if (error.value) {
      // errorMessage.value = error.value.data.message;
      // }
      if (data.value) {
        imageError.value = null;
        toast.add({
          severity: "info",
          summary: "Success",
          detail: data.value.message,
          life: 3000,
        });
      }
      colors.value[findIndexById(product.value.id)] = product.value;
      // product.value.inventoryStatus = product.value.inventoryStatus.value
      //   ? product.value.inventoryStatus.value
      //   : product.value.inventoryStatus;
      // products.value[findIndexById(product.value.id)] = product.value;
      // toast.add({
      //   severity: "success",
      //   summary: "Successful",
      //   detail: "Product Updated",
      //   life: 3000,
      // });
    } else {
      const { data, error } = await useApiFetch("/api/colors", {
        method: "POST",
        body: product.value,
      });
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
      // product.value.image = "product-placeholder.svg";
      // product.value.inventoryStatus = product.value.inventoryStatus
      //   ? product.value.inventoryStatus.value
      //   : "Enable";
      // products.value.push(product.value);
      // toast.add({
      //   severity: "success",
      //   summary: "Successful",
      //   detail: "Product Created",
      //   life: 3000,
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
    imageError.value = null;
    product.value.image_id = data.value.media.id
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
  const { data, error } = await useApiFetch("/api/colors/" + product.value.id, {
    method: "DELETE",
  });
  // errorMessage.value = null;
  // if (error.value) {
  //   errorMessage.value = error.value.data.message;
  // }
  if (data.value) {
    toast.add({
      severity: "success",
      summary: "Product Deleted",
      detail: data.value.message,
      life: 3000,
    });
  }
  colors.value = colors.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  // toast.add({
  //   severity: "success",
  //   summary: "Successful",
  //   detail: "Product Deleted",
  //   life: 3000,
  // });
};

const findIndexById = (id) => {
  let index = -1;

  for (let i = 0; i < colors.value.length; i++) {
    if (colors.value[i].id === id) {
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
          :value="colors"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h3 class="m-0">Colors</h3>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"
              >
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
          <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="name" header="Hex" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Hex</span>
              {{ slotProps.data.hex }}
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
          <Form id="add_category_form" @submit="saveProduct" :validation-schema="schema" v-slot="{ errors }">
            
            <div class="field">
              <label for="name">Name</label>
              <Field v-model="product.name" id="name" name="name" :class="{ 'p-invalid': errors.name }" class="p-inputtext p-component" aria-describedby="category-name-error" placeholder="Name"/>
              <small class="p-error" id="category-name-error">{{ errors.name || '&nbsp;' }}</small>
            </div>
            <div class="formgrid grid">
              <div class="field col">
                <label for="hex">Hex</label>
                <Field v-model="product.hex" id="hex" name="hex" :class="{ 'p-invalid': errors.hex }" class="p-inputtext p-component" aria-describedby="category-hex-error" placeholder="Color hex"/> 
                <small class="p-error" id="category-hex-error">{{ errors.hex || '&nbsp;' }}</small>
              </div>
              <div class="field col-3">
                <label for="color-picker">Pick Color</label>
                <ColorPicker  inputId="cp-hex" format="hex" v-model="product.hex"/>
              </div>
            </div>

            <div class="field">
              <label for="colorFamily" class="mb-3">Color Family</label>
              <Field name="colorFamily" v-slot="{ field }">
                <Dropdown
                  v-bind="field"
                  v-model="product.color_family_id"
                  :options="colorFamilies" 
                  optionLabel="name" 
                  optionValue="id" 
                  placeholder="Select a Color Family"
                  display="chip"
                  :class="{ 'p-invalid': errors.colorFamily }"
                  aria-describedby="category-colorFamily-error"
                ></Dropdown>
              </Field>
              <small class="p-error" id="category-colorFamily-error">{{
                errors.colorFamily || "&nbsp;"
              }}</small>
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
              <label for="status" class="mb-3">Status</label>
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
            <Button class="" type="submit" label="Submit"  icon="pi pi-check"/>
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
