<script setup>
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import {nextTick, onMounted, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import {useApiFetch} from "~/composables/useApiFetch";

const router = useRouter();
const toast = useToast();

const banners = ref([]);
const deleteBannerDialog = ref(false);
const banner = ref({});
const selectedBanners = ref(null);
const dt = ref(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const page = ref(1);
const totalData = ref(null);
const rowsPerPage = ref(0)
const totalRecords = ref(0)

onMounted(async () => {
  await nextTick();
  await fetchFaqs();
});
const fetchFaqs = async (event) => {
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/banners/?page=" + page, {
    method: "GET",
  });
  if (data.value) {
    banners.value = data.value.banners.data;
    rowsPerPage.value = data.value.banners.per_page
    totalRecords.value = data.value.banners.total
  }
};

const editFaq = (id) => {
  console.log(editFaq)
  router.push({ path: "/pages/banners/update/" + id });
};

const confirmDeleteFaq = (editFaq) => {
  banner.value = editFaq;
  deleteBannerDialog.value = true;
};

const deleteBanner = () => {
  banners.value = banners.value.filter((val) => val.id !== banner.value.id);
  deleteBannerDialog.value = false;
  banner.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Banner Deleted",
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
          v-model:selection="selectedBanners"
          :value="banners"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} banners"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="col-12"></div>

            <div class="flex flex-column">
              <div class="flex align-items-center justify-content-between m-2">
                <h3 class="m-0">Banners</h3>

                <div class="flex align-items-center justify-content-end m-2">
                  <span class="block mt-2 md:mt-0 p-input-icon-left mr-2">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Search..."
                    />
                  </span>

                  <NuxtLink to="/pages/banners/create">
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

          <Column selectionMode="multiple" style="width: 5%"></Column>
          <Column header="Image" :sortable="true" style="width: 15%">
            <template #body="slotProps">
              <Image :src="slotProps.data.media?.url" alt="image" width="80" class="w-6rem shadow-2 border-round" preview />
            </template>
          </Column>
          <Column field="name" header="Name" :sortable="true" style="width: 10%">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="description" header="Description" :sortable="true" style="width: 30%">
            <template #body="slotProps">
              <span v-html="slotProps.data.description"></span>
            </template>
          </Column>
          <Column field="pages" header="Pages" style="width: 20%">
            <template #body="slotProps">
              <div class="flex align-items-center flex-row sm:flex-row gap-1" >
                <div v-for="(page, index) in slotProps.data.pages" :key="index">
                  <Tag class="me-2" :value="page.name"></Tag>
                </div>
              </div>
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true" style="width: 10%">
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              <span :class="'banner-badge status-' +
                  (slotProps.data.status ? slotProps.data.status.toLowerCase()  : '') ">{{ slotProps.data.status }}</span>
            </template>
          </Column>
          <Column header="Actions" style="width: 10%">
            <template #body="slotProps">
              <span class="p-buttonset">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded mr-2"
                  @click="editFaq(slotProps.data.id)"
                />

                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  class="p-button-text p-button-rounded"
                  @click="confirmDeleteFaq(slotProps.data)"
                />
              </span>
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="deleteBannerDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="banner">Are you sure you want to delete <b>{{ banner.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteBannerDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteBanner"
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
