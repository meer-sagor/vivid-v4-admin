<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import {nextTick, onMounted, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import {useFaqsStore} from "~/stores/useFaqsStore";
import {useApiFetch} from "~/composables/useApiFetch";
const faqsStore = useFaqsStore();

const router = useRouter();
const toast = useToast();

const faqs = ref([]);
const deleteFaqDialog = ref(false);
const faq = ref({});
const selectedFaqs = ref(null);
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
  const { data, error } = await useApiFetch("/api/faqs/?page=" + page, {
    method: "GET",
  });
  if (data.value) {
    faqs.value = data.value.faqs.data;
    rowsPerPage.value = data.value.faqs.per_page
    totalRecords.value = data.value.faqs.total
  }
};

const editFaq = (id) => {
  console.log(editFaq)
  router.push({ path: "/pages/faqs/update/" + id });
};

const confirmDeleteFaq = (editFaq) => {
  faq.value = editFaq;
  deleteFaqDialog.value = true;
};

const deleteProduct = () => {
  faqs.value = faqs.value.filter((val) => val.id !== faq.value.id);
  deleteFaqDialog.value = false;
  faq.value = {};
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
          v-model:selection="selectedFaqs"
          :value="faqs"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} faqs"
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

          <Column selectionMode="multiple" style="width: 5%"></Column>
          <Column field="title" header="Title" :sortable="true" style="width: 15%">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
          </Column>
          <Column field="pages" header="Pages" style="width: 30%">
            <template #body="slotProps">
              <div class="flex align-items-center flex-row sm:flex-row gap-1" >
                <div v-for="(page, index) in slotProps.data.pages" :key="index">
                  <Tag class="me-2" :value="page.name"></Tag>
                </div>
              </div>
            </template>
          </Column>
          <Column field="name" header="Questions" style="width: 5%">
            <template #body="slotProps">
              <Tag class="me-2" :value="slotProps.data.faq_questions.length"></Tag>
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true" style="width: 15%">
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              <span :class="'faq-badge status-' +
                  (slotProps.data.status ? slotProps.data.status.toLowerCase()  : '') ">{{ slotProps.data.status }}</span>
            </template>
          </Column>
          <Column header="Actions" style="width: 15%">
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
          v-model:visible="deleteFaqDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="faq"
              >Are you sure you want to delete <b>{{ faq.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteFaqDialog = false"
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
