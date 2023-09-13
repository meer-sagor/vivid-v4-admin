<script setup>
import { ref, onMounted  } from "vue";
import { useRolesStore } from "@/stores/useRolesStore";
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const rolesStore = useRolesStore();
const search = ref(null);
const page = ref(1);
const totalData = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({});
const id = ref(null);
const errorMessage = ref("");
const mode = ref("add");
const customers = ref([
  {
    id: 1,
    name: "James Butt",
    status: "Enabled",
    created_at: null,
  },
]);
const roles = ref([]);
// const publishedBooksMessage = computed(() => {
//   return author.books.length > 0 ? 'Yes' : 'No'
// })
const fetchRoles = async () => {
    await rolesStore.getRoles();
    if (rolesStore.roles) {
        roles.value = rolesStore.roles;
    }
};

onMounted(async () => {
  console.log('calling');
    // await fetchRoles(); // Call the fetchRoles function
    // console.log(roles.value);  // Check if roles are populated
    await initialize();
});
const showProductDialog = () => {
  productDialog.value = true;
  mode.value = "add";
}
const showEditDialog = (data) => {
  mode.value = "edit";
  id.value = data.id;
  product.value.name = data.name;
  productDialog.value = true;
}
const showDeleteDialog = (data) => {
  id.value = data.id;
  product.value.name = data.name;
  deleteProductDialog.value = true;
}
const initialize = async () => {
  const { data, error } = await useApiFetch("/api/roles?page="+page.value, {
    method: "GET",
  });
  console.log(data,'calling');
    errorMessage.value = null;
    if (error.value) {
      errorMessage.value = error.value.data.message;
    }
    if (data.value) {
      console.log(data.value);
      roles.value = data.value.roles.data;
      totalData.value  = data.value.roles.total
    }
}
const onPaginate = (event) => {
  console.log(event);
}
const deleteProduct = async () => {
  const { data, error } = await useApiFetch("/api/roles/" + id.value, {
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
    }
}
const saveProduct = async () => {
  productDialog.value = true;
  product.value.guard_name = 'api';
  if (mode.value == "add") {
    const { data, error } = await useApiFetch("/api/roles", {
      method: "POST",
      body: product.value,
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
    }
  } else {
    console.log('edit');
    const { data, error } = await useApiFetch("/api/roles/" + id.value, {
      method: "PUT",
      body: product.value,
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
    }
  }
  
}
const hideDialog = () => {
  productDialog.value = false;
}
// const roles = ref([]);

// onMounted(async () => {
//   const response = await rolesStore.getRoles();
//   console.log(response)
//   // if (response.data) {
//   //   roles.value = response.data
//   // }
// })

// console.log('roles', roles)


</script>
<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        {{ roles }}
        <DataTable
            :value="roles"
            data-key="id"
            :paginator="true"
            :rows="5"
            @page="onPaginate"
            :totalRecords="totalData"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="initialize" />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div class="flex justify-content-between flex-column sm:flex-row">
              <div class="col-2">
                <Button
                    type="button"
                    icon="pi pi-plus"
                    label="Add New"
                    class="p-button-outlined mb-2"
                    @click="showProductDialog()"
                />
              </div>
              <div class="col-4">
                <span class="p-input-icon-left mb-2">
                  <i class="pi pi-search" />
                  <InputText
                      v-model="search"
                      placeholder="Keyword Search"
                      style="width: 100%"
                  />
                </span>
              </div>
            </div>
          </template>
          
          <Column field="id" header="ID" style="width: 25%"></Column>
          <Column field="name" header="Name" style="width: 25%"></Column>
          <Column field="status" header="Status" style="width: 25%"></Column>
          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="mr-2" 
                @click="showEditDialog(slotProps.data)"
              />
              <Button
                  icon="pi pi-trash"
                  outlined
                  rounded
                  severity="danger" 
                  @click="showDeleteDialog(slotProps.data)"
              />
            </template>
          </Column>
          <!-- <Paginator
            
            @page="onPaginate"
          /> -->
        </DataTable>
        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="Role Manage"
          :modal="true"
          class="p-fluid"
        >
          <!-- <img
            v-if="product.image"
            :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
            :alt="product.image"
            class="block m-auto pb-3"
          /> -->
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="product.name"
              required="true"
              autofocus
             
            />
            <!-- <small class="p-error" v-if="submitted && !product.name"
              >Name is required.</small
            > -->
          </div>
          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              text
              @click="hideDialog"
            />
            <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
          </template>
        </Dialog>
        <Dialog
          v-model:visible="deleteProductDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="product"
              >Are you sure you want to delete <b>{{ product.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              text
              @click="deleteProductDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              text
              @click="deleteProduct"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
