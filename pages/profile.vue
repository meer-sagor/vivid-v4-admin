<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import { apiURL } from "@/config/environment";
import { useApiFetch } from "@/composables/useApiFetch";
const toast = useToast();
const auth = useAuthStore();

const uploadURL = apiURL + "/api/profile-image";

const form = ref({
  name: auth.user.name,
  old_email: auth.user.email,
  email: auth.user.email,
  // password: "",
  new_password: "",
});

const fileInput = ref(null);
const files = ref();

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

const handleProfileUpdate = async () => {
  console.log(form.value);

  await useApiFetch("/api/profile/update", {
    method: "POST",
    body: form.value,
  });
};

const testAPI = async () => {
  const { data } = await useApiFetch("/api/user");
  console.log(data);
};

definePageMeta({
  middleware: ["auth"],
});
</script>
<template>
  <div class="grid p-fluid">
    <div class="col-6">
      <div class="card">
        <Button
          @click="testAPI"
          label="Test"
          outlined
          class="mr-2 mb-2"
        ></Button>

        <h5>Profile Image</h5>
        <span class="p-float-label">
          <FileUpload
            ref="fileInput"
            :showCancelButton="false"
            :showUploadButton="false"
            name="profile[]"
            @select="onPhotoSelect($event)"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
          >
            <template #empty>
              <p>Drag and drop files to here to upload.</p>
            </template>
          </FileUpload>

          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <Button
              @click="uploadPhoto"
              label="Begin Upload"
              icon="pi pi-cloud-upload"
              size="small"
              outlined
              class="mr-2 mb-2"
            ></Button>
          </div>
        </span>

        <form @submit.prevent="handleProfileUpdate">
          <h5>Name</h5>
          <InputText v-model="form.name" type="text" placeholder="Name" />

          <h5>Email</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-user" />
            <InputText v-model="form.email" type="email" placeholder="Email" />
          </span>

          <!-- <h5>Old Password</h5>
          <InputText
            v-model="form.password"
            type="password"
            placeholder="Old Password"
          /> -->

          <h5>New Password</h5>
          <InputText
            v-model="form.new_password"
            type="text"
            placeholder="New Password"
          />

          <div style="margin-top: 1rem">
            <Button type="submit" label="Submit" class="mr-2 mb-2"></Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
