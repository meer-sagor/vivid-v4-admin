<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable :value="fonts" data-key="id" tableStyle="min-width: 50rem">
          <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="fetchFonts"/>
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
                <NuxtLink type="button" icon="pi pi-plus" class="p-button p-component p-button-primary mr-2" :to="{ path: '/fonts/create' }">
                  <span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
                  Add Font
                </NuxtLink>
              </div>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 5%"></Column>
          <Column field="name" header="Name" style="width: 15%"></Column>
          <Column field="size" header="Size" style="width: 15%"></Column>
          <Column field="file_type" header="File Type" style="width: 20%"></Column>
          <Column field="font_category_id" header="Font Category" style="width: 15%">
            <template #body="slotProps">
              {{ slotProps.data.font_category?.name }}
            </template>
          </Column>
          <Column field="status" header="Status" style="width: 15%">
            <template #body="slotProps">
              <div class="flex d-flex">
                <div style="margin-right: 4px !important; margin-top: 3px !important;">
                  <span v-if="slotProps.data.status == 'enable'">Enable</span>
                  <span v-if="slotProps.data.status == 'disable'">Disable</span>
                </div>
              </div>
            </template>
          </Column>
          <Column :exportable="false" header="Actions"  style="width: 15%">
            <template #body="slotProps">
              <NuxtLink
                  type="button"
                  icon="pi pi-plus"
                  class="p-button p-component p-button-icon-only p-button-primary p-button-rounded p-button-outlined mr-2"
                  :to="{ path: '/fonts/update/' + slotProps.data.id }"
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
            v-model:visible="deleteFontDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="font">Are you sure you want to delete <b>{{ font.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteFontDialog = false"
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
const toast = useToast();
const fontsStore = useFontsStore();
const search = ref(null);
const page = ref(1);
const totalData = ref(null);
const deleteFontDialog = ref(false);
const font = ref({});
const id = ref(null);
const fonts = ref([]);
const errorMessage = ref("");
const checked = ref(true);

const fetchFonts = async () => {
  await fontsStore.getFonts();
  if (fontsStore.fonts) {
    fonts.value = fontsStore.fonts;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchFonts();
});

const showDeleteDialog = (data) => {
  id.value = data.id;
  font.value.name = data.name;
  deleteFontDialog.value = true;
};
const deleteFont = async () => {
  const { data, error } = await useApiFetch("/api/font-categories/" + id.value, {
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
    deleteFontDialog.value = false
    await fetchFonts()
  }
};

</script>
<style scoped>

</style>

