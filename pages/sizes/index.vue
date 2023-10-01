<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref ,nextTick,watch, computed} from "vue";
//filters
const { $dateFilter } = useNuxtApp();
const fetching = ref(false);
const spinner = ref(false);
const toast = useToast();
const sizes = ref([]);
const rowsPerPage = ref(0)
const totalRecords = ref(0)
const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const search = ref(null);
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
  // ProductService.getProducts().then((data) => (products.value = data));
  await nextTick();
  await initialize();
});
const initialize = async (event) => {
  spinner.value = true
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/sizes/?page=" + page + searchTerm.value, {
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
    sizes.value = data.value.sizes.data;
    console.log(data.value.sizes);
    rowsPerPage.value = data.value.sizes.per_page
    totalRecords.value = data.value.sizes.total
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
        "/api/sizes/" + product.value.id,
        {
          method: "PUT",
          body: product.value,
        }
      );
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
      sizes.value[findIndexById(product.value.id)] = product.value;
    } else {
      product.value.is_default = 0;
      const { data, error } = await useApiFetch("/api/sizes", {
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
  const { data, error } = await useApiFetch("/api/sizes/" + product.value.id, {
    method: "DELETE",
  });
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
      severity: "success",
      summary: "Product Deleted",
      detail: data.value.message,
      life: 3000,
    });
    fabrics.value = fabrics.value.filter((val) => val.id !== product.value.id);
    product.value = {};
  }
  deleteProductDialog.value = false;
};

const findIndexById = (id) => {
  let index = -1;

  for (let i = 0; i < sizes.value.length; i++) {
    if (sizes.value[i].id === id) {
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
          :value="sizes"
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
              <h3 class="m-0">Sizes</h3>
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
          <Column field="description" header="Width" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Width</span>
              {{ slotProps.data.width }}
            </template>
          </Column>
          <Column field="description" header="Length" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Length</span>
              {{ slotProps.data.length }}
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
          <div class="field">
            <label for="order">Order</label>
            <InputNumber
              id="order"
              v-model.trim="product.order"
              mode="decimal"
              required="true"
              showButtons 
              :min="0"
              autofocus
              :class="{ 'p-invalid': submitted && !product.order }"
            />
            <small v-if="submitted && !product.order" class="p-invalid"
              >order is required.</small
            >
          </div>

          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="product.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid"
              >Name is required.</small
            >
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="price">Width</label>
              <InputNumber
                id="price"
                v-model="product.width"
                :class="{ 'p-invalid': submitted && !product.width }"
                :required="true"
              />
              <small v-if="submitted && !product.width" class="p-invalid"
                >Width is required.</small
              >
            </div>
            <div class="field col">
              <label for="quantity">Length</label>
              <InputNumber
                id="quantity"
                v-model="product.length"
                :class="{ 'p-invalid': submitted && !product.length }"
                :required="true"
                integeronly
              />
              <small v-if="submitted && !product.length" class="p-invalid"
                >Length is required.</small
              >
            </div>
          </div>

          <div class="field">
            <label for="inventoryStatus" class="mb-3">Status</label>
            <Dropdown
              id="inventoryStatus"
              v-model="product.status"
              :options="statuses"
              optionLabel="label"
              placeholder="Select a Status"
              :class="{ 'p-invalid': submitted && !product.status }"
              :required="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span
                    :class="'product-badge status-' + slotProps.value.value"
                    >{{ slotProps.value.label }}</span
                  >
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span
                    :class="
                      'product-badge status-' + slotProps.value.toLowerCase()
                    "
                    >{{ slotProps.value }}</span
                  >
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small v-if="submitted && !product.status" class="p-invalid"
                >Status is required.</small
              >
          </div>

          <template #footer>
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
          </template>
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
