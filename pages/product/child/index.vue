<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import {nextTick, onMounted, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import {useApiFetch} from "~/composables/useApiFetch";

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const fetching = ref(false);
const spinner = ref(false);
const child_products = ref([]);
const statuses = ref([]);
const childProductDialog = ref(false);
const deleteChildProductDialog = ref(false);
const deleteChildProductsDialog = ref(false);
const child_product = ref({});
const dt = ref(null);
const selectedChildProducts = ref(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});


onMounted(async () => {
  await nextTick();
  await fetchCodes()
  await fetchChildProducts()
});

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
  }
};

const fetchChildProducts = async (event) => {
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/child-products/?page=" + page, {
    method: "GET",
  });
  if (data.value) {
    child_products.value = data.value.child_products.data;
    rowsPerPage.value = data.value.child_products.per_page
    totalRecords.value = data.value.child_products.total
  }
};

const editProduct = (id) => {
  router.push({ path: "/product/child/update/" + id });
};

const confirmDeleteChildProduct = (editProduct) => {
  child_product.value = editProduct;
  deleteChildProductDialog.value = true;
};
const deleteChildProduct = async (id) => {
  const { data, error } = await useApiFetch("/api/child-products/" + id, {
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
    deleteChildProductDialog.value = false
    await fetchChildProducts()
  }
};


const confirmDeleteSelected = () => {
  deleteChildProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
  child_products.value = child_products.value.filter(
    (val) => !selectedChildProducts.value.includes(val)
  );
  deleteChildProductsDialog.value = false;
  selectedChildProducts.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Products Deleted",
    life: 3000,
  });
};

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
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <DataTable
          ref="dt"
          v-model:selection="selectedChildProducts"
          :value="child_products"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} child products"
          responsiveLayout="scroll"
        >
          <h3 class="mb-4">Child Products</h3>
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-end md:align-items-center"
            >
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"
              >
                <div class="flex gap-2 md:align-items-center">
                  <label for="status" class="mb-0">Status</label>
                  <Dropdown
                    id="status"
                    v-model="child_product.status"
                    :options="statuses"
                    optionLabel="label"
                    placeholder="Select a Status"
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value && slotProps.value.value">
                        <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                      </div>
                      <div v-else-if="slotProps.value && !slotProps.value.value">
                        <span :class=" 'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
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
          <Column header="Image">
            <template #body="slotProps">
              <Image :src="slotProps.data.media?.url" alt="image" width="80" class="w-6rem shadow-2 border-round" preview />
            </template>
          </Column>
          <Column field="color" header="Color" :sortable="true">
            <template #body="slotProps">
              {{ slotProps.data.color?.name }}
            </template>
          </Column>
          <Column field="fabric" header="Fabric">
            <template #body="slotProps">
              {{ slotProps.data.fabric?.name }}
            </template>
          </Column>
          <Column field="sizes" header="Sizes">
            <template #body="slotProps">
              <div class="flex align-items-center flex-row sm:flex-row gap-1" >
                <div v-for="(size, index) in slotProps.data.sizes" :key="index">
                  <Tag class="me-2" :value="size.size?.name"></Tag>
                </div>
              </div>
            </template>
          </Column>
          <Column field="sides" header="Sides">
            <template #body="slotProps">
              <div class="flex align-items-center flex-row sm:flex-row gap-1" >
                <div v-for="(child_product_side, index) in slotProps.data.child_product_sides" :key="index">
                  <Tag class="me-2" :value="child_product_side.side"></Tag>
                </div>
              </div>
            </template>
          </Column>
          <Column field="quantity" header="Quantity"></Column>
          <Column field="status" header="Status" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              <span :class=" 'product-badge status-' +
                  (slotProps.data.status ? slotProps.data.status.toLowerCase(): '')">{{ slotProps.data.status }}</span>
            </template>
          </Column>
          <Column class="text-right">
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
                  @click="confirmDeleteChildProduct(slotProps.data)"
                />
              </span>
          
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="deleteChildProductDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="child_product">Are you sure you want to delete <b>{{ child_product.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteChildProductDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteChildProduct(child_product.id)"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
  </template>
  <div class="flex justify-content-center">
    <ProgressSpinner v-if="spinner" />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
