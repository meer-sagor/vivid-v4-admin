<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref , nextTick,watch, computed} from "vue";
import {Field, Form, useField, useForm} from 'vee-validate';
import * as Yup from "yup";
const {handleSubmit, resetForm} = useForm();
const fetching = ref(false);
const spinner = ref(false);
const schema = Yup.object({
  name: Yup.string().required().min(2).max(50).label("Name"),
  status: Yup.mixed().required().label("status"),
});
const toast = useToast();

const products = ref(null);
const search = ref(null);
const brands = ref([]);
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
// wathcer 
watch(search, (newValue, oldValue) => {
  initialize();
});
// Computed
const searchTerm = computed(() => {
  return search.value ? '&name=' + search.value : ''
})
onMounted(async () => {
  await nextTick();
  await initialize();
});
const initialize = async (event) => {
  spinner.value = true
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/brands/?page=" + page + searchTerm.value, {
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
    brands.value = data.value.brands.data;
    rowsPerPage.value = data.value.brands.per_page
    totalRecords.value = data.value.brands.total
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
  submitted.value = true;
  console.log(product.value);
  if (product.value.name && product.value.name.trim()) {
    product.value.status = product.value.status.value
      ? product.value.status.value
      : product.value.status;
    if (product.value.id) {
      product.value.status = product.value.status.toUpperCase()
      const { data, error } = await useApiFetch(
        "/api/brands/" + product.value.id,
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
        toast.add({
          severity: "info",
          summary: "Success",
          detail: data.value.message,
          life: 3000,
        });
      }
      brands.value[findIndexById(product.value.id)] = product.value;
      // toast.add({
      //     severity: 'success',
      //     summary: 'Successful',
      //     detail: 'Product Updated',
      //     life: 3000
      // });
    } else {
      const { data, error } = await useApiFetch("/api/brands", {
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

const editProduct = (editProduct) => {
  product.value = { ...editProduct };
  product.value.status = product.value.status.toUpperCase()
  console.log(product);
  productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
  product.value = editProduct;
  deleteProductDialog.value = true;
};

const deleteProduct = async () => {
  const { data, error } = await useApiFetch("/api/brands/" + product.value.id, {
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
  }
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  // toast.add({
  //     severity: 'success',
  //     summary: 'Successful',
  //     detail: 'Product Deleted',
  //     life: 3000
  // });
};

const findIndexById = (id) => {
  let index = -1;

  for (let i = 0; i < brands.value.length; i++) {
    if (brands.value[i].id === id) {
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
</script>

<template>
  <div class="grid">
    <div class="col-12" v-if="fetching">
      <div class="card">
        <Toast />
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="brands"
          :lazy="true"
          dataKey="id"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :first="first"
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
              <h3 class="m-0">Brands</h3>
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
          <Column field="description" header="Description" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Description</span>
              {{ slotProps.data.description }}
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
          <Column field="updated_at" header="Updated_at" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Updated_at</span>
              {{ slotProps.data.updated_at }}
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
          header="Brand info"
          :modal="true"
          class="p-fluid"
        >
        <Form id="add_brands_form" @submit="saveProduct" :validation-schema="schema" v-slot="{ errors }">
          <div class="field">
            <Field v-model="product.name" id="name" name="name" :class="{ 'p-invalid': errors.name }" class="p-inputtext p-component" aria-describedby="category-name-error" placeholder="Category name"/>
            <small class="p-error" id="brnad-name-error">{{ errors.name || '&nbsp;' }}</small>
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
                aria-describedby="brand-code-status-error"
              ></Dropdown>
            </Field>
            <small class="p-error" id="brand-code-status-error">{{
              errors.status || "&nbsp;"
            }}</small>
          </div>
          <Button class="" type="submit" label="Submit"  icon="pi pi-check"/>
        </Form>
          <!-- <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              class="p-button-text"
              @click="saveProduct"
            />
          </template> -->
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
