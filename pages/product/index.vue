<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import {nextTick, onMounted, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import {useApiFetch} from "~/composables/useApiFetch";

const router = useRouter();
const toast = useToast();

const products = ref([]);
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


onMounted(async () => {
  await nextTick();
  await fetchProducts()
});


const fetchProducts = async (event) => {
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/products/?page=" + page, {
    method: "GET",
  });
  if (data.value) {
    products.value = data.value.products.data;
    rowsPerPage.value = data.value.products.per_page
    totalRecords.value = data.value.products.total
  }
};

const editProduct = (id) => {
  router.push({ path: "/product/update/" + id });
};

const confirmDeleteProduct = (editProduct) => {
  product.value = editProduct;
  deleteProductDialog.value = true;
};


const deleteProduct = async (id) => {
  const { data, error } = await useApiFetch("/api/products/" + id, {
    method: "DELETE",
  });
  if (error.value) {
    toast.add({
      severity: "info",
      summary: "Success",
      detail: error.value.data.message,
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
    deleteProductDialog.value = false
    await fetchProducts()
  }
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
                <h3 class="m-0">Product</h3>

                <div class="flex align-items-center justify-content-end m-2">
                  <span class="block mt-2 md:mt-0 p-input-icon-left mr-2">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Search..."
                    />
                  </span>

                  <NuxtLink to="/product/create">
                    <Button
                      label="New"
                      icon="pi pi-plus"
                      class="p-button-primary mr-2"
                    />
                  </NuxtLink>
                  <Button
                    label="Import"
                    icon="pi pi-upload"
                    class="p-button-success mr-2"
                  />
                </div>
              </div>

              <Accordion :activeIndex="0">
                <AccordionTab header="Filters">
                  <div
                    class="flex flex-column md:flex-row md:justify-content-left md:align-items-center gap-3"
                  >
                    <div class="flex gap-2 md:align-items-center">
                      <Dropdown
                        id="inventoryStatus"
                        v-model="product.inventoryStatus"
                        :options="statuses"
                        optionLabel="label"
                        placeholder="Select a Brand"
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
                            v-else-if="
                              slotProps.value && !slotProps.value.value
                            "
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
                      <Dropdown
                        id="inventoryStatus"
                        v-model="product.inventoryStatus"
                        :options="statuses"
                        optionLabel="label"
                        placeholder="Select a Category"
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
                            v-else-if="
                              slotProps.value && !slotProps.value.value
                            "
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
                      <Dropdown
                        id="inventoryStatus"
                        v-model="product.inventoryStatus"
                        :options="statuses"
                        optionLabel="label"
                        placeholder="Select a Subcategory"
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
                            v-else-if="
                              slotProps.value && !slotProps.value.value
                            "
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
                            v-else-if="
                              slotProps.value && !slotProps.value.value
                            "
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
                  </div>
                </AccordionTab>
              </Accordion>
            </div>
          </template>

          <Column selectionMode="multiple"></Column>
          <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="style_number" header="Style Number"></Column>
          <Column field="sub_category" header="Sub Category">
            <template #body="slotProps">
              {{ slotProps.data.sub_category?.name }}
            </template>
          </Column>
          <Column field="brand" header="Brand">
            <template #body="slotProps">
              {{ slotProps.data.brand?.name}}
            </template>
          </Column>
          <Column header="Childs">
            <template #body="slotProps">
              <span class="p-column-title">Childs</span>
              <NuxtLink :to="{ path: '/product/child'}" class="mr-4">
                <Button
                  severity="info"
                  :label="slotProps.data.child_products?.length || 0"
                  class="p-button p-component p-button-rounded"
                />
              </NuxtLink>
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              <span
                :class="'product-badge status-' +(slotProps.data.status? slotProps.data.status.toLowerCase()
                  : '')">{{ slotProps.data.status }}</span>
            </template>
          </Column>
          <Column header="Actions" class="text-center" style="min-width: 150px">
            <template #body="slotProps">
              <span class="p-buttonset">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded mr-2"
                  @click="editProduct(slotProps.data.id)"
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
              @click="deleteProduct(product.id)"
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
