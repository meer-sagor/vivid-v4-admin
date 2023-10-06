<script setup>
import {ref, onMounted, nextTick} from "vue";
import { useAssociatesStore } from "@/stores/useAssociatesStore";
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
import {FilterMatchMode} from "primevue/api";
const toast = useToast();
const associatesStore = useAssociatesStore();
const search = ref(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const page = ref(1);
const totalData = ref(null);
const deleteAssociateDialog = ref(false);
const associate = ref({});
const id = ref(null);
const errorMessage = ref("");
const associates = ref([]);
const rowsPerPage = ref(0)
const totalRecords = ref(0)
const fetchAssociates = async (event) => {
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/associates/?page=" + page, {
    method: "GET",
  });
  if (data.value) {
    associates.value = data.value.users.data;
    rowsPerPage.value = data.value.users.per_page
    totalRecords.value = data.value.users.total
  }
};

onMounted(async () => {
  await nextTick();
  await fetchAssociates();
});
const showDeleteDialog = (data) => {
  id.value = data.id;
  associate.value.name = data.name;
  deleteAssociateDialog.value = true;
};
const deleteAssociate = async () => {
  const { data, error } = await useApiFetch("/api/associates/" + id.value, {
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
    deleteAssociateDialog.value = false
    await fetchAssociates()
  }
};
</script>
<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable
          :value="associates"
          :lazy="true"
          dataKey="id"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          @page="fetchAssociates"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Total {totalRecords} Associates"
          responsiveLayout="scroll"
        >
          <template #paginatorstart>
            <Button
              type="button"
              icon="pi pi-refresh"
              text
              @click="fetchAssociates"
            />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h3 class="m-0">Associates</h3>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"
              >
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Search..." />
                </span>
                <NuxtLink
                    type="button"
                    icon="pi pi-plus"
                    class="p-button p-component p-button-primary mr-2"
                    :to="{ path: '/associates/create' }"
                >
                  <span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
                  Add Associate
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
          <Column field="full_name" header="Full Name" style="width: 20%"></Column>
          <Column field="email" header="Email" style="width: 20%"></Column>
          <Column field="roles" header="Roles" style="width: 20%">
            <template #body="slotProps">
              <span v-for="(role, index) in slotProps.data.roles" :key="index">
                <Badge :value="role.name"></Badge>
              </span>
            </template>
          </Column>
          <Column field="status" header="Status" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.status == '1'">Active</span>
              <span v-if="slotProps.data.status == '0'">Inactive</span>
            </template>
          </Column>
          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <NuxtLink
                  type="button"
                  icon="pi pi-plus"
                  class="p-button p-component p-button-icon-only p-button-primary p-button-rounded p-button-outlined mr-2"
                  :to="{ path: '/associates/update/' + slotProps.data.id }"
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
            v-model:visible="deleteAssociateDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="associate">Are you sure you want to delete <b>{{ associate.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteAssociateDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteAssociate"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
