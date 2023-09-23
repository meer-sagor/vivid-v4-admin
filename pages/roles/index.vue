<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable
            :value="roles"
            data-key="id"
            tableStyle="min-width: 50rem"
        >
          <template #paginatorstart>
            <Button
                type="button"
                icon="pi pi-refresh"
                text
                @click="fetchRoles"
            />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h3 class="m-0">Roles</h3>
              <div
                  class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"
              >
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="search" placeholder="Search..." />
                </span>
                <NuxtLink
                    type="button"
                    icon="pi pi-plus"
                    class="p-button p-component p-button-primary mr-2"
                    :to="{ path: '/roles/create' }"
                >
                  <span class="p-button-icon p-button-icon-left pi pi-plus" data-pc-section="icon"></span>
                  Add Role
                </NuxtLink>
              </div>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 25%"></Column>
          <Column field="name" header="Name" style="width: 25%"></Column>
          <Column field="permissions" header="Permissions" style="width: 25%">
            <template #body="slotProps">
              <span v-for="(permission, index) in slotProps.data.permissions" :key="index">
                <Badge :value="permission.name"></Badge>
              </span>
            </template>
          </Column>
          <Column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <NuxtLink
                  type="button"
                  icon="pi pi-plus"
                  class="p-button p-component p-button-icon-only p-button-primary p-button-rounded p-button-outlined mr-2"
                  :to="{ path: '/roles/update/' + slotProps.data.id }"
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
            v-model:visible="deleteRoleDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="role">Are you sure you want to delete <b>{{ role.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteRoleDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteRole"
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
const toast = useToast();
const rolesStore = useRolesStore();
const search = ref(null);
const page = ref(1);
const totalData = ref(null);
const deleteRoleDialog = ref(false);
const role = ref({});
const id = ref(null);
const roles = ref([]);
const errorMessage = ref("");

const fetchRoles = async () => {
  await rolesStore.getRoles();
  if (rolesStore.roles) {
    roles.value = rolesStore.roles;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchRoles();
});

const showDeleteDialog = (data) => {
  id.value = data.id;
  role.value.name = data.name;
  deleteRoleDialog.value = true;
};
const deleteRole = async () => {
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
    deleteRoleDialog.value = false
    await fetchRoles()
  }
};

</script>

