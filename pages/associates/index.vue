<script setup>
import {ref, onMounted, nextTick} from "vue";
import { useAssociatesStore } from "@/stores/useAssociatesStore";
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
import {FilterMatchMode} from "primevue/api";
const toast = useToast();
const associatesStore = useAssociatesStore();
const search = ref(null);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const page = ref(1);
const totalData = ref(null);
const submitted = ref(false);
const associateDialog = ref(false);
const deleteAssociateDialog = ref(false);
const associate = ref({});
const id = ref(null);
const errorMessage = ref("");
const mode = ref("add");
const associates = ref([]);
const rowsPerPage = ref(0)
const totalRecords = ref(0)
const userRoles = ref([]);
const fileInput = ref(null);
const files = ref();
const uploading = ref(false);
const onPhotoSelect = (event) => {
  files.value = event.files[0];
};
const fetchAssociates = async (event) => {
  let page = 1
  if (event?.first){
    page = event.first / event.rows + 1;
  }
  const { data, error } = await useApiFetch("/api/associates/?page=" + page, {
    method: "GET",
  });
  if (data.value) {
    associates.value = data.value.users.data;
    rowsPerPage.value = data.value.users.per_page
    totalRecords.value = data.value.users.total
  }
};
const fetchRoles = async (event) => {
  const { data, error } = await useApiFetch("/api/associate/getRoles", {
    method: "GET",
  });
  if (data.value) {
    userRoles.value = data.value.roles;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchAssociates();
  await fetchRoles();
});
const showAssociateDialog = () => {
  associateDialog.value = true;
  mode.value = "add";
};
const showEditDialog = (data) => {
  mode.value = "edit";
  id.value = data.id;
  associate.value = data;
  associate.value.selected_roles = data.roles.map(role => role.id);
  associateDialog.value = true;
};
const showDeleteDialog = (data) => {
  id.value = data.id;
  associate.value.name = data.name;
  deleteAssociateDialog.value = true;
};
const deleteAssociate = async () => {
  const { data, error } = await useApiFetch("/api/associates/" + id.value, {
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
    deleteAssociateDialog.value = false
    await fetchAssociates()
  }
};
const saveAssociate = async () => {
  associateDialog.value = true;
  submitted.value = true;
  uploading.value = true;

  const body = new FormData();
  body.append("first_name", associate.value.first_name);
  body.append("last_name", associate.value.last_name);
  body.append("email", associate.value.email);
  body.append("password", associate.value.password);
  body.append("roles",  JSON.stringify(associate.value.roles));
  body.append("image", files.value);

  if (mode.value == "add") {
    const { data, error } = await useApiFetch("/api/associates/store", {
      method: "POST",
      body: body,
    });
    errorMessage.value = null;
    if (error.value) {
      errorMessage.value = error.value.data.message;
    }
    if (data.value) {
      uploading.value = false;
      toast.add({
        severity: "info",
        summary: "Success",
        detail: data.value.message,
        life: 3000,
      });
      associateDialog.value = false;
      submitted.value = false;
      associate.value = '';
      await fetchAssociates()
    }
  } else {
    const { data, error } = await useApiFetch("/api/associates/update/" + id.value, {
      method: "POST",
      body: body,
    });
    errorMessage.value = null;
    if (error.value) {
      errorMessage.value = error.value.data.message;
    }
    if (data.value) {
      uploading.value = false;
      toast.add({
        severity: "info",
        summary: "Success",
        detail: data.value.message,
        life: 3000,
      });

      associateDialog.value = false;
      await fetchAssociates()
    }
  }
};
const hideDialog = () => {
  associateDialog.value = false;
  submitted.value = false;
  associate.value = '';
};

</script>
<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <DataTable
          :value="associates"
          :lazy="true"
          dataKey="id"
          :paginator="true"
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          @page="fetchAssociates"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Total {totalRecords} Associates"
          responsiveLayout="scroll"
        >
          <template #paginatorstart>
            <Button
              type="button"
              icon="pi pi-refresh"
              text
              @click="fetchAssociates"
            />
          </template>
          <template #paginatorend>
            <Button type="button" icon="pi pi-download" text />
          </template>

          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h3 class="m-0">Associates</h3>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3"
              >
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Search..." />
                </span>
                <Button
                  label="Add Associate"
                  icon="pi pi-plus"
                  class="p-button-primary mr-2"
                  @click="showAssociateDialog()"
                />
              </div>
            </div>
          </template>

          <Column field="id" header="ID" style="width: 5%"></Column>
          <Column header="Full Name" style="width: 10%">
            <template #body="slotProps">
              <Image :src="slotProps.data.media?.url" alt="image" width="80" class="w-6rem shadow-2 border-round" preview />
            </template>
          </Column>
          <Column field="full_name" header="Full Name" style="width: 20%"></Column>
          <Column field="email" header="Email" style="width: 20%"></Column>
          <Column field="roles" header="Roles" style="width: 20%">
            <template #body="slotProps">
              <span v-for="(role, index) in slotProps.data.roles">
                <Badge :value="role.name"></Badge>
              </span>
            </template>
          </Column>
          <Column field="status" header="Status" style="width: 10%">
            <template #body="slotProps">
              <span v-if="slotProps.data.status == '1'">Active</span>
              <span v-if="slotProps.data.status == '0'">Inactive</span>
            </template>
          </Column>
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
        </DataTable>
        <Dialog
            v-model:visible="associateDialog"
            :style="{ width: '450px' }"
            :header="mode == 'add' ? 'Add Associate info' : 'Update Associate info'"
            :modal="true"
            class="p-fluid"
        >
          <div class="field">
            <label for="first_name">First Name</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
            <InputText
                id="name"
                v-model.trim="associate.first_name"
                required="true"
                autofocus
                placeholder="Enter first name"
                :class="{ 'p-invalid': submitted && !associate.first_name }"
            />
            </span>
            <small v-if="submitted && !associate.first_name" class="p-invalid">First name is required.</small>
          </div>
          <div class="field">
            <label for="last_name">Last Name</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
            <InputText
                id="name"
                v-model.trim="associate.last_name"
                required="true"
                autofocus
                placeholder="Enter last name"
                :class="{ 'p-invalid': submitted && !associate.last_name }"
            />
            </span>
            <small v-if="submitted && !associate.last_name" class="p-invalid">Last name is required.</small>
          </div>
          <div class="field">
            <label for="email">Email</label>
            <span class="p-input-icon-left">
              <i class="pi pi-envelope" />
            <InputText
                id="name"
                v-model.trim="associate.email"
                required="true"
                autofocus
                placeholder="Enter email address"
                :class="{ 'p-invalid': submitted && !associate.email }"
            />
            </span>
            <small v-if="submitted && !associate.email" class="p-invalid">Email is required.</small>
          </div>
          <div class="field" v-if="mode == 'add'">
            <label for="password">Password</label>
            <span class="p-input-icon-left">
              <i class="pi pi-key" />
            <InputText
                type="password"
                id="password"
                v-model.trim="associate.password"
                required="true"
                autofocus
                placeholder="Enter password"
                :class="{ 'p-invalid': submitted && !associate.password }"
            />
            </span>
            <small v-if="submitted && !associate.password" class="p-invalid">Password is required.</small>
          </div>
          <div class="field">
            <label for="roles">Roles</label>
            <MultiSelect
                    v-model="associate.selected_roles"
                    :options="userRoles"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select multiple roles"
                    display="chip"
                    :class="{ 'p-invalid': submitted && !associate.roles }"
            ></MultiSelect>
            <small v-if="submitted && !associate.roles" class="p-invalid">Roles is required.</small>
          </div>
          <div class="field" v-if="mode == 'add'">
            <label for="image">Image</label>
            <FileUpload
                ref="fileInput"
                mode="basic"
                accept="image/*"
                :maxFileSize="1000000"
                name="image"
                @select="onPhotoSelect($event)"
            />
           </div>

          <template #footer>
            <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text"
                @click="hideDialog"
            />
            <Button
                :label="mode == 'add' ? 'Save Associate' : 'Update Associate'"
                icon="pi pi-check"
                class="p-button-text"
                @click="saveAssociate"
            />
            <ProgressSpinner
                v-if="uploading"
                style="width: 30px; height: 30px"
            ></ProgressSpinner>
          </template>
        </Dialog>
        <Dialog
            v-model:visible="deleteAssociateDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="associate">Are you sure you want to delete <b>{{ associate.name }}</b>?</span>
          </div>
          <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteAssociateDialog = false"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteAssociate"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
