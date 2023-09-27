<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable
            :value="home_sections"
            data-key="id"
            tableStyle="min-width: 50rem"
        >
          <template #paginatorstart>
            <Button
                type="button"
                icon="pi pi-refresh"
                text
                @click="fetchHomeSections"
            />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h3 class="m-0">Home Sections</h3>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="search" placeholder="Search..." />
                </span>
                <NuxtLink
                    type="button"
                    icon="pi pi-plus"
                    class="p-button p-component p-button-primary mr-2"
                    :to="{ path: '/home/section/create' }">
                  <span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
                  Add Home Section
                </NuxtLink>
              </div>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 5%"></Column>
          <Column field="name" header="Name" style="width: 10%"></Column>
          <Column field="section_title" header="Section Title" style="width: 15%"></Column>
          <Column field="description" header="Description" style="width: 25%"></Column>
          <Column field="view_all_url" header="Url" style="width: 15%"></Column>
          <Column field="status" header="Status" style="width: 10%">
            <template #body="slotProps">
              <div class="flex d-flex">
                <div style="margin-right: 4px !important; margin-top: 3px !important;">
                  <span v-if="slotProps.data.status == 'enable'">Enable</span>
                  <span v-if="slotProps.data.status == 'disable'">Disable</span>
                </div>
                <input
                    type="checkbox"
                    :checked="slotProps.data.status == 'enable'"
                    :id="'checkbox_' + slotProps.data.status.id"
                    :name="'checkbox_' + slotProps.data.status.id"
                    @change="updateStatus(slotProps.data)"
                />

              </div>
            </template>
          </Column>
          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <NuxtLink
                  type="button"
                  icon="pi pi-plus"
                  class="p-button p-component p-button-icon-only p-button-primary p-button-rounded p-button-outlined mr-2"
                  :to="{ path: '/home/section/update/' + slotProps.data.id }"
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
            v-model:visible="deleteHomeSectionDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="home_section">Are you sure you want to delete <b>{{ home_section.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteHomeSectionDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteHomeSection"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from "vue";
import { useRolesStore } from "@/stores/useRolesStore";
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
import {useHomeSectionStore} from "~/stores/useHomeSectionStore";
const { $swal } = useNuxtApp()
const toast = useToast();
const HomeSectionStore = useHomeSectionStore();
const search = ref(null);
const page = ref(1);
const totalData = ref(null);
const deleteHomeSectionDialog = ref(false);
const home_section = ref({});
const id = ref(null);
const home_sections = ref([]);
const errorMessage = ref("");
const fetchHomeSections = async () => {
  await HomeSectionStore.getHomeSections();
  if (HomeSectionStore.home_sections) {
    home_sections.value = HomeSectionStore.home_sections;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchHomeSections();
});

const showDeleteDialog = (data) => {
  id.value = data.id;
  home_section.value.name = data.name;
  deleteHomeSectionDialog.value = true;
};
const deleteHomeSection = async () => {
  const { data, error } = await useApiFetch("/api/home-sections/" + id.value, {
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
    deleteHomeSectionDialog.value = false
    await fetchHomeSections()
  }
};

const updateStatus = (home_section) => {
  $swal.fire({
    title: "Confirm",
    text: `Are you sure to update "${home_section.name}" status?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F85606',
    cancelButtonColor: '#525252',
    confirmButtonText: 'Yes, Changed it!',
    cancelButtonText: 'No, cancel!',
    buttonsStyling: true
  }).then(async function (isConfirm) {
    if (isConfirm.value === true) {
      await useApiFetch("/api/home-section/status" , {
        method: "POST",
        body: {
          id: home_section.id,
          status: home_section.status.toUpperCase(),
        },
      });

      await fetchHomeSections()
    }
  });
}

</script>

