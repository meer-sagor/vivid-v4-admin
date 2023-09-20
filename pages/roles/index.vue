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
const submitted = ref(false);
const roleDialog = ref(false);
const deleteRoleDialog = ref(false);
const role = ref({});
const id = ref(null);
const errorMessage = ref("");
const mode = ref("add");
const roles = ref([]);

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
const showRoleDialog = () => {
  roleDialog.value = true;
  mode.value = "add";
};
const showEditDialog = (data) => {
  mode.value = "edit";
  id.value = data.id;
  role.value.name = data.name;
  roleDialog.value = true;
};
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
const saveRole = async () => {
  roleDialog.value = true;
  submitted.value = true;
  role.value.guard_name = "api";
  if (mode.value == "add") {
    const { data, error } = await useApiFetch("/api/roles", {
      method: "POST",
      body: role.value,
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
      roleDialog.value = false;
      submitted.value = false;
      role.value.name = '';
      await fetchRoles()
    }
  } else {
    const { data, error } = await useApiFetch("/api/roles/" + id.value, {
      method: "PUT",
      body: role.value,
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

      roleDialog.value = false;
      await fetchRoles()
    }
  }
};
const hideDialog = () => {
  roleDialog.value = false;
  submitted.value = false;
  role.value = {};
};

</script>
<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <!-- {{ roles }} -->
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
                <Button
                  label="Add Role"
                  icon="pi pi-plus"
                  class="p-button-primary mr-2"
                  @click="showRoleDialog()"
                />
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
            v-model:visible="roleDialog"
            :style="{ width: '450px' }"
            header="Role info"
            :modal="true"
            class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
                id="name"
                v-model.trim="role.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !role.name }"
            />
            <small v-if="submitted && !role.name" class="p-invalid">Name is required.</small>
          </div>

          <template #footer>
            <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text"
                @click="hideDialog"
            />
            <Button
                :label="mode == 'add' ? 'Save Role' : 'Update Role'"
                icon="pi pi-check"
                class="p-button-text"
                @click="saveRole"
            />
          </template>
        </Dialog>

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
