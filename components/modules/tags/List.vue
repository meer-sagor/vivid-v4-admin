<script setup>
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref, nextTick ,watch, computed} from "vue";
import {Field, Form, useField, useForm} from 'vee-validate';
import * as Yup from "yup";
const {handleSubmit, resetForm} = useForm();
const fetching = ref(false);
const spinner = ref(false);
const schema = Yup.object({
  name: Yup.string().required().min(2).max(15).label("Name"),
  status: Yup.mixed().required().label("status"),
});
const toast = useToast();

const tags = ref([]);
const tagDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const search = ref(null);
const selectedTags = ref(null);
const dt = ref(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
  { label: "Enable", value: "ENABLE" },
  { label: "Disable", value: "DISABLE" },
]);


const rowsPerPage = ref(0)
const totalRecords = ref(0)
// wathcer 
watch(search, (newValue, oldValue) => {
  getTags();
});
// Computed
const searchTerm = computed(() => {
  return search.value ? '&name=' + search.value : ''
})
onMounted(async () => {
  await nextTick();
  await getTags();
});
const getTags = async (event) => {
  spinner.value = true
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }

  const { data, error } = await useApiFetch("/api/tags/?page=" + page + searchTerm.value, {
    method: "GET",
  });
  spinner.value = false
  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something Went worng",
      life: 3000,
    });
  }
  if (data.value) {
    fetching.value = true
    tags.value = data.value.tags.data;

    //For pagination
    rowsPerPage.value = data.value.tags.per_page
    totalRecords.value = data.value.tags.total
  }
};

const openNew = () => {
  product.value = {};
  product.value.status = "ENABLE";
  submitted.value = false;
  tagDialog.value = true;
};

const hideDialog = () => {
  tagDialog.value = false;
  submitted.value = false;
};

const saveTag = async () => {
  submitted.value = true;
  console.log(product.value);
  if (product.value.name && product.value.name.trim()) {
    product.value.status = product.value.status.value
      ? product.value.status.value
      : product.value.status;
    if (product.value.id) {
      console.log(product.value.status);
      product.value.status = product.value.status.toUpperCase()
      const { data, error } = await useApiFetch(
        "/api/tags/" + product.value.id,
        {
          method: "PUT",
          body: product.value,
        }
      );
      // errorMessage.value = null;
      if (error.value) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Something Went worng",
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
      }
      tags.value[findIndexById(product.value.id)] = product.value;
      // toast.add({
      //     severity: 'success',
      //     summary: 'Successful',
      //     detail: 'Product Updated',
      //     life: 3000
      // });
    } else {
      const { data, error } = await useApiFetch("/api/tags", {
        method: "POST",
        body: product.value,
      });
      if (error.value) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Something Went worng",
          life: 3000,
        });
      }
      if (data.value) {
        await getTags();
        toast.add({
          severity: "info",
          summary: "Success",
          detail: data.value.message,
          life: 3000,
        });
      }
      tags.value.push(product.value);
      // toast.add({
      //     severity: 'success',
      //     summary: 'Successful',
      //     detail: 'Product Created',
      //     life: 3000
      // });
    }

    tagDialog.value = false;
    product.value = {};
  }
};

const editTag = (editTag) => {
  product.value = { ...editTag };
  product.value.status = product.value.status.toUpperCase()
  console.log(product.value);
  tagDialog.value = true;
};

const confirmDeleteProduct = (editTag) => {
  product.value = editTag;
  deleteProductDialog.value = true;
};

const deleteProduct = async () => {
  const { data, error } = await useApiFetch("/api/tags/" + product.value.id, {
    method: "DELETE",
  });
  // errorMessage.value = null;
  if (error.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Something Went worng",
      life: 3000,
    });
  }
  if (data.value) {
    toast.add({
      severity: "success",
      summary: "Product Deleted",
      detail: data.value.message,
      life: 3000,
    });
    tags.value = tags.value.filter((val) => val.id !== product.value.id);
    product.value = {};
  }
  deleteProductDialog.value = false;
};

const findIndexById = (id) => {
  let index = -1;

  for (let i = 0; i < tags.value.length; i++) {
    if (tags.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

const deleteSelectedTag = () => {
  tags.value = tags.value.filter(
    (val) => !selectedTags.value.includes(val)
  );
  deleteProductsDialog.value = false;
  selectedTags.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Tag Deleted",
    life: 3000,
  });
};
</script>

<template>
  <div class="grid">
    <div class="col-12" v-if="fetching">
      <div class="card">
        <Toast />
        <DataTable
          ref="dt"
          v-model:selection="selectedTags"
          :value="tags"
          :lazy="true"
          dataKey="id"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :first="first"
          @page="getTags"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Total {totalRecords} tags"
          responsiveLayout="scroll"
        >
          <template #paginatorstart>
            <Button
              type="button"
              icon="pi pi-refresh"
              text
              @click="getTags"
            />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h3 class="m-0">Tags</h3>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="search" placeholder="Search..."/>
                </span>
                <Button label="New" icon="pi pi-plus" class="p-button-outlined mr-2" @click="openNew"/>
              </div>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="inventoryStatus" header="Status" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Status</span>
              <span
                :class="'product-badge status-' +
                  (slotProps.data.status  ? slotProps.data.status.toLowerCase() : '') ">{{ slotProps.data.status }}</span>
            </template>
          </Column>
          <Column field="created_at" header="Created at" :sortable="true">
            <template #body="slotProps">
              <span class="p-column-title">Created at</span>
              {{ slotProps.data.created_at }}
            </template>
          </Column>
          <Column class="text-right">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-outlined mr-2"
                @click="editTag(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-outlined mt-2"
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="tagDialog"
          :style="{ width: '450px' }"
          header="Edit Details"
          :modal="true"
          class="p-fluid"
        >
          <Form id="add_brands_form" @submit="saveTag" :validation-schema="schema" v-slot="{ errors }">
            <!-- <div class="field">
              <label for="name">Name</label>
              <InputText
                id="name"
                v-model.trim="product.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !product.name }"
              />
              <small v-if="submitted && !product.name" class="p-invalid">Name is required.</small>
            </div> -->
            <div class="field">
              <Field v-model="product.name" id="name" name="name" :class="{ 'p-invalid': errors.name }" class="p-inputtext p-component" aria-describedby="category-name-error" placeholder="Tags name"/>
              <small class="p-error" id="brnad-name-error">{{ errors.name || '&nbsp;' }}</small>
            </div>

            <!-- <div class="field">
              <label for="inventoryStatus" class="mb-3">Status</label>
              <Dropdown
                id="inventoryStatus"
                v-model="product.status"
                :options="statuses"
                optionLabel="label"
                placeholder="Select a Status"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                  </div>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
              </Dropdown>
            </div> -->
            <div class="field">
              <label for="status" class="mb-3">Status</label>
              <Field name="status" v-slot="{ field }">
                <Dropdown
                  v-bind="field"
                  v-model="product.status"
                  :options="statuses"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select a status"
                  display="chip"
                  :class="{ 'p-invalid': errors.status }"
                  aria-describedby="brand-code-status-error"
                ></Dropdown>
              </Field>
              <small class="p-error" id="brand-code-status-error">{{
                errors.status || "&nbsp;"
              }}</small>
            </div>
            <Button class="" type="submit" label="Submit"  icon="pi pi-check"/>
          </Form>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
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
              @click="deleteProduct"
            />
          </template>
        </Dialog>
      </div>
    </div>
    <div class="col-12">
      <div class="flex justify-content-center">
        <ProgressSpinner v-if="spinner"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
