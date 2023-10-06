<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable
            :value="cliparts"
            :lazy="true"
            dataKey="id"
            :paginator="true"
            :rows="rowsPerPage"
            :totalRecords="totalRecords"
            @page="fetchCliparts"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Total {totalRecords} Cliparts"
            responsiveLayout="scroll">
          <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="fetchCliparts"/>
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h3 class="m-0">Font </h3>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="search" placeholder="Search..." />
                </span>
                <NuxtLink type="button" icon="pi pi-plus" class="p-button p-component p-button-primary mr-2" :to="{ path: '/cliparts/create' }">
                  <span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
                  Add Clipart
                </NuxtLink>
              </div>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 5%"></Column>
          <Column header="Image" style="width: 10%">
            <template #body="slotProps">
              <Image :src="slotProps.data.media?.url" alt="image" width="80" class="w-6rem shadow-2 border-round" preview />
            </template>
          </Column>
          <Column field="name" header="Name" style="width: 15%"></Column>
          <Column :exportable="false" header="Actions"  style="width: 15%">
            <template #body="slotProps">
              <NuxtLink
                  type="button"
                  icon="pi pi-plus"
                  class="p-button p-component p-button-icon-only p-button-primary p-button-rounded p-button-outlined mr-2"
                  :to="{ path: '/cliparts/update/' + slotProps.data.id }"
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
            v-model:visible="deleteClipartDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="font">Are you sure you want to delete <b>{{ clipart.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteClipartDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteFont"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from "vue";
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
import {useFontsStore} from "~/stores/useFontsStore";
import {useClipartsStore} from "~/stores/useClipartsStore";
import {FilterMatchMode} from "primevue/api";
const toast = useToast();
const search = ref(null);
const deleteClipartDialog = ref(false);
const clipart = ref({});
const id = ref(null);
const cliparts = ref([]);
const errorMessage = ref("");
const checked = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const page = ref(1);
const totalData = ref(null);
const rowsPerPage = ref(0)
const totalRecords = ref(0)
const fetchCliparts = async (event) => {
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/cliparts/?page=" + page, {
    method: "GET",
  });
  if (data.value) {
    cliparts.value = data.value.cliparts.data;
    rowsPerPage.value = data.value.cliparts.per_page
    totalRecords.value = data.value.cliparts.total
  }
};

onMounted(async () => {
  await nextTick();
  await fetchCliparts();
});

const showDeleteDialog = (data) => {
  id.value = data.id;
  clipart.value.name = data.name;
  deleteClipartDialog.value = true;
};
const deleteFont = async () => {
  const { data, error } = await useApiFetch("/api/cliparts/" + id.value, {
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
    deleteClipartDialog.value = false
    await fetchCliparts()
  }
};

</script>
<style scoped>

</style>

