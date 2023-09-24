<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable
            :value="promo_codes"
            data-key="id"
            tableStyle="min-width: 50rem"
        >
          <template #paginatorstart>
            <Button
                type="button"
                icon="pi pi-refresh"
                text
                @click="fetchPromoCodes"
            />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h3 class="m-0">Promo Codes</h3>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="search" placeholder="Search..." />
                </span>
                <NuxtLink
                    type="button"
                    icon="pi pi-plus"
                    class="p-button p-component p-button-primary mr-2"
                    :to="{ path: '/marketing/promo-codes/create' }">
                  <span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
                  Add Promo Code
                </NuxtLink>
              </div>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 5%"></Column>
          <Column field="name" header="Name" style="width: 20%"></Column>
          <Column field="description" header="Description" style="width: 25%"></Column>
          <Column field="discount_type" header="Discount Type" style="width: 10%"></Column>
          <Column field="discount_amount" header="Discount Amount" style="width: 10%"></Column>
          <Column field="expiry_date" header="Expiry Date" style="width: 10%"></Column>
          <Column field="status" header="Status" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.status == 'enable'">Enable</span>
              <span v-if="slotProps.data.status == 'disable'">Disable</span>
            </template>
          </Column>
          <Column :exportable="false" style="width: 10%">
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
            v-model:visible="deletePromoCodeDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="promo_code">Are you sure you want to delete <b>{{ promo_code.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deletePromoCodeDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deletePromoCode"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from "vue";
import { useApiFetch } from "~/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
import { usePromoCodeStore} from "~/stores/usePromoCodeStore";
const toast = useToast();
const PromoCodeStore = usePromoCodeStore();
const search = ref(null);
const page = ref(1);
const totalData = ref(null);
const deletePromoCodeDialog = ref(false);
const promo_code = ref({});
const id = ref(null);
const promo_codes = ref([]);
const errorMessage = ref("");
const fetchPromoCodes = async () => {
  await PromoCodeStore.getPromoCodes();
  if (PromoCodeStore.promo_codes) {
    promo_codes.value = PromoCodeStore.promo_codes;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchPromoCodes();
});

const showDeleteDialog = (data) => {
  id.value = data.id;
  promo_code.value.name = data.name;
  deletePromoCodeDialog.value = true;
};
const deletePromoCode = async () => {
  const { data, error } = await useApiFetch("/api/promo-codes/" + id.value, {
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
    deletePromoCodeDialog.value = false
    await fetchPromoCodes()
  }
};

</script>

