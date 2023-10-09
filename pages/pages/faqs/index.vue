<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

const products = ref(null);
const deleteProductDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(() => {
  ProductService.getProducts().then((data) => (products.value = data));
});

const editProduct = (editProduct) => {
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
</script>

<template>
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
          <template #header>
            <div class="col-12"></div>

            <div class="flex flex-column">
              <div class="flex align-items-center justify-content-between m-2">
                <h3 class="m-0">FAQs</h3>

                <div class="flex align-items-center justify-content-end m-2">
                  <span class="block mt-2 md:mt-0 p-input-icon-left mr-2">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Search..."
                    />
                  </span>

                  <NuxtLink to="/pages/faqs/create">
                    <Button
                      label="New"
                      icon="pi pi-plus"
                      class="p-button-primary mr-2"
                    />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>

          <Column selectionMode="multiple"></Column>
          <Column field="name" header="Title" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="name" header="Pages">
            <template #body>
              <span class="p-column-title">Pages</span>
              <div class="flex align-items-center flex-column sm:flex-row">
                <Tag class="mr-2" value="Landing"></Tag>
                <Tag class="mr-2" value="Catalog"></Tag>
                <Tag class="mr-2" value="Designs"></Tag>
                <Tag class="mr-2" value="Products"></Tag>
                <Tag class="mr-2" value="Custom T Shirt"></Tag>
              </div>
            </template>
          </Column>
          <Column field="name" header="Questions">
            <template #body>
              <span class="p-column-title">Questions</span>
              5
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
          <Column field="updated_at" header="Updated" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Updated</span>
              {{ slotProps.data.updated_at }}
            </template>
          </Column>
          <Column class="text-right">
            <template #body="slotProps">
              <NuxtLink :to="{ path: '/pages/faqs/create' }" class="mr-4">
                <Button
                  severity="default"
                  label="View Questions"
                  class="p-button p-component p-button-outlined"
                />
              </NuxtLink>
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
