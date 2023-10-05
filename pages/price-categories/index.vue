<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable :value="price_categories" data-key="id" tableStyle="min-width: 50rem">
          <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="fetchPriceCategories"/>
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h3 class="m-0">Price Category </h3>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="search" placeholder="Search..." />
                </span>
                <NuxtLink type="button" icon="pi pi-plus" class="p-button p-component p-button-primary mr-2" :to="{ path: '/price-categories/create' }">
                  <span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
                  Add Price Category
                </NuxtLink>
              </div>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 5%"></Column>
          <Column field="name" header="Name" style="width: 15%"></Column>
          <Column field="size_id" header="Size" style="width: 15%">
            <template #body="slotProps">
              {{ slotProps.data.size?.name }}
            </template>
          </Column>
          <Column :exportable="false" header="Actions"  style="width: 15%">
            <template #body="slotProps">
              <NuxtLink
                  type="button"
                  icon="pi pi-plus"
                  class="p-button p-component p-button-icon-only p-button-primary p-button-rounded p-button-outlined mr-2"
                  :to="{ path: '/price-categories/update/' + slotProps.data.id }"
              >
                <span class="p-button-icon p-button-icon-left pi pi-pencil" data-pc-section="icon"></span>
              </NuxtLink>
              <Button
                  icon="pi pi-trash"
                  outlined
                  rounded
                  severity="danger"
                  @click="showDeleteDialog(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
        <Dialog
            v-model:visible="deletePriceCategoryDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="price_category">Are you sure you want to delete <b>{{ price_category.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deletePriceCategoryDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deletePriceCategory"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import {ref, onMounted, nextTick} from "vue";
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
import {useFontsStore} from "~/stores/useFontsStore";
import {usePriceCategoriesStore} from "~/stores/usePriceCategoriesStore";
const toast = useToast();
const priceCategoriesStore = usePriceCategoriesStore();
const search = ref(null);
const page = ref(1);
const totalData = ref(null);
const deletePriceCategoryDialog = ref(false);
const price_category = ref({});
const id = ref(null);
const price_categories = ref([]);
const errorMessage = ref("");
const checked = ref(true);

const fetchPriceCategories = async () => {
  await priceCategoriesStore.getPriceCategories();
  if (priceCategoriesStore.price_categories) {
    price_categories.value = priceCategoriesStore.price_categories;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchPriceCategories();
});

const showDeleteDialog = (data) => {
  id.value = data.id;
  price_category.value.name = data.name;
  deletePriceCategoryDialog.value = true;
};
const deletePriceCategory = async () => {
  const { data, error } = await useApiFetch("/api/price-categories/" + id.value, {
    method: "DELETE",
  });
  errorMessage.value = null;
  if (error.value) {
    errorMessage.value = error.value.data.message;
  }
  if (data.value) {
    toast.add({
      severity: "info",
      summary: "Success",
      detail: data.value.message,
      life: 3000,
    });
    deletePriceCategoryDialog.value = false
    await fetchPriceCategories()
  }
};

</script>
<style scoped>

</style>

