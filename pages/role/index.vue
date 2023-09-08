<script setup>
import { ref, onMounted } from "vue";
import { useRolesStore } from "@/stores/useRolesStore";
const rolesStore = useRolesStore();
const search = ref(null);
const customers = ref([
  {
    id: 1,
    name: "James Butt",
    status: "Enabled",
    created_at: null,
  },
]);
const roles = ref([]);
const fetchRoles = async () => {
    await rolesStore.getRoles();
    if (rolesStore.roles) {
        roles.value = rolesStore.roles;
    }
};
onMounted(async () => {
    await fetchRoles(); // Call the fetchRoles function
    console.log(roles.value);  // Check if roles are populated
});


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
            :value="customers"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <template #paginatorstart>
            <Button type="button" icon="pi pi-refresh" text @click="fetchRoles" />
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
                  class="mr-2" />
              <Button
                  icon="pi pi-trash"
                  outlined
                  rounded
                  severity="danger"  />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
