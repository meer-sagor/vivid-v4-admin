<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import { apiURL } from "@/config/environment";
import { useApiFetch } from "@/composables/useApiFetch";
const toast = useToast();
const auth = useAuthStore();

const uploadURL = apiURL + "/api/profile-image";

const form = ref({
  name: "",
  description: "",
  role: "",
});

const fileInput = ref(null);
const files = ref();
const userRoles = ref([
  { name: "Admin", code: "NY" },
  { name: "Customer Care", code: "RM" },
  { name: "Finance", code: "LDN" },
  { name: "Accounts", code: "IST" },
  { name: "Traffic Ops", code: "PRS" },
]);

const roles = ref([{ name: "Admin", description: "Admin" }]);

const onPhotoSelect = ($event) => {
  files.value = fileInput.value?.files;
};

const uploadPhoto = () => {
  const file = files.value[0];
  console.log(file);

  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

const handleRole = async () => {
  console.log(form.value);
};

const permissions = ref([
  { name: "add user", value: "edit-user" },
  { name: "edit user", value: "edit-user" },
  { name: "add product", value: "edit-user" },
  { name: "edit product", value: "edit-user" },
]);

const isCreate = ref(false);

definePageMeta({
  middleware: ["auth"],
});
</script>
<template>
  <!-- <div class="grid p-fluid"> -->
  <div class="flex justify-content-end">
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <Button
        @click="isCreate = !isCreate"
        outlined
        :label="isCreate ? 'Show All' : 'Create New'"
        :icon="isCreate ? 'pi pi-list' : 'pi pi-plus'"
      />
    </div>
  </div>
  <div class="flex justify-content-center">
    <div class="col-7">
      <div class="card" v-if="isCreate">
        <h5>Create Role</h5>

        <div class="grid p-fluid">
          <div class="col-12 md:col-12">
            <form @submit.prevent="handleRole">
              <div class="field col-12 md:col-12">
                <label for="state">Role Name</label>
                <InputText v-model="form.name" type="text" placeholder="Name" />
              </div>

              <div class="field col-12 md:col-12">
                <label for="state">Description</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-user" />
                  <InputText
                    v-model="form.description"
                    type="text"
                    placeholder="Description"
                  />
                </span>
              </div>

              <div class="field col-6 md:col-6">
                <h5>Permissions</h5>
                <div class="grid">
                  <div
                    class="col-12 md:col-6"
                    v-for="(permission, index) in permissions"
                    :key="index"
                  >
                    <div class="field-checkbox mb-0">
                      <Checkbox
                        :id="index"
                        v-model="permission.value"
                        name="option"
                        :value="permission.name"
                      />
                      <label for="checkOption1">{{ permission.name }}</label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field col-12 md:col-12">
                <label for="roles">Roles</label>
                <Dropdown
                  id="roles"
                  v-model="form.role"
                  :options="userRoles"
                  optionLabel="Roles"
                  placeholder="Select One"
                ></Dropdown>
              </div>

              <div class="field col-12 md:col-12">
                <Button
                  type="submit"
                  label="Create Role"
                  class="mr-2 mb-2"
                ></Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="card" v-if="!isCreate">
        <DataTable :value="roles" tableStyle="min-width: 50rem">
          <Column field="name" header="Name"></Column>
          <Column field="description" header="Description"></Column>
          <Column field="action" header="Action"></Column>
        </DataTable>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
.p-input-icon-left {
  width: 100%;
}
</style>
