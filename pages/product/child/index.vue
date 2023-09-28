<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const switchValue = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
  { label: "Enable", value: "enable" },
  { label: "Disable", value: "disable" },
]);

onMounted(() => {
  ProductService.getProducts().then((data) => (products.value = data));
});

const formatCurrency = (value) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

const saveProduct = () => {
  submitted.value = true;

  if (product.value.name && product.value.name.trim() && product.value.price) {
    if (product.value.id) {
      product.value.inventoryStatus = product.value.inventoryStatus.value
        ? product.value.inventoryStatus.value
        : product.value.inventoryStatus;
      products.value[findIndexById(product.value.id)] = product.value;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });
    } else {
      product.value.id = createId();
      product.value.code = createId();
      product.value.image = "product-placeholder.svg";
      product.value.inventoryStatus = product.value.inventoryStatus
        ? product.value.inventoryStatus.value
        : "Enable";
      products.value.push(product.value);
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Created",
        life: 3000,
      });
    }

    productDialog.value = false;
    product.value = {};
  }
};

const editProduct = (editProduct) => {
  // product.value = { ...editProduct };
  // console.log(product);
  // productDialog.value = true;
  router.push({ path: "/product/create" });
};

const confirmDeleteProduct = (editProduct) => {
  product.value = editProduct;
  deleteProductDialog.value = true;
};

const deleteProduct = () => {
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Product Deleted",
    life: 3000,
  });
};

const findIndexById = (id) => {
  let index = -1;

  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
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
    <div class="col-12">
      <div class="card">
        <Toast />
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="products"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >
          <h3 class="mb-4">Child Product</h3>
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-end md:align-items-center"
            >
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"
              >
                <div class="flex gap-2 md:align-items-center">
                  <label for="inventoryStatus" class="mb-0">Status</label>
                  <Dropdown
                    id="inventoryStatus"
                    v-model="product.inventoryStatus"
                    :options="statuses"
                    optionLabel="label"
                    placeholder="Select a Status"
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
                    v-model="filters['global'].value"
                    placeholder="Search..."
                  />
                </span>

                <NuxtLink to="/product/child/create">
                  <Button
                    label="New"
                    icon="pi pi-plus"
                    class="p-button-primary mr-2"
                  />
                </NuxtLink>
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
          <Column header="Image" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Image</span>
              <img
                :src="'/demo/images/product/' + slotProps.data.image"
                :alt="slotProps.data.image"
                style="border-radius: 4px"
                width="50"
              />
            </template>
          </Column>
          <Column field="name" header="Style Numer" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Style Numer</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="name" header="Quantity" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Quantity</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="name" header="Sub Category" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Sub Category</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="name" header="Brand" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Brand</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="name" header="Childs" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Childs</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="inventoryStatus" header="Status" :sortable="true">
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
          <Column field="updated_at" header="Updated_at" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Updated_at</span>
              {{ slotProps.data.updated_at }}
            </template>
          </Column>
          <Column class="text-right" style="min-width: 270px">
            <template #body="slotProps">
              <!-- <NuxtLink :to="{ path: '/product/child' }" class="mr-4">
                View Child
              </NuxtLink> -->
              <span class="p-buttonset">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded mr-2"
                  @click="editProduct(slotProps.data)"
                />

                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  class="p-button-text p-button-rounded"
                  @click="confirmDeleteProduct(slotProps.data)"
                />
              </span>
              <!-- <div class="formgrid grid">
                <div class="field col">
                  <div class="grid">
                    <div class="col-4 ml-4">
                      <Button
                        icon="pi pi-pencil"
                        class="p-button-text p-button-rounded mr-2"
                        @click="editProduct(slotProps.data)"
                      />
                    </div>
                    <div class="col-4">
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        class="p-button-text p-button-rounded"
                        @click="confirmDeleteProduct(slotProps.data)"
                      />
                    </div>
                  </div>
                </div>
                <div class="field col">
                  <div class="col-4">
                    <Button
                      severity="default"
                      label="Child"
                      class="p-button-rounded small"
                      @click="confirmDeleteProduct(slotProps.data)"
                    />
                  </div>
                </div>
              </div> -->
            </template>
          </Column>
        </DataTable>

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
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
