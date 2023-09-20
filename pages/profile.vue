<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import { apiURL, baseURL } from "@/config/environment";
import { useApiFetch } from "@/composables/useApiFetch";
import { ref } from "vue";
const toast = useToast();
const auth = useAuthStore();

const form = ref({
  name: auth.user.name,
  old_email: auth.user.email,
  email: auth.user.email,
  role: auth.user.role,
  new_password: "",
  confirm_password: "",
});

const fileInput = ref(null);
const files = ref();
const uploading = ref(false);
const userRole = ref("");
const userRoles = ref([
  { name: "Admin", code: "NY" },
  { name: "Customer Care", code: "RM" },
  { name: "Finance", code: "LDN" },
  { name: "Accounts", code: "IST" },
  { name: "Traffic Ops", code: "PRS" },
]);
const errorMessage = ref("");

const onPhotoSelect = ($event) => {
  files.value = fileInput.value?.files;
};

const uploadHandler = async (event) => {
  uploading.value = true;
  const fileUp = event.files[0];
  const body = new FormData();
  body.append("profile_img", fileUp);

  const { data } = await useApiFetch("/api/profile/img/update", {
    method: "POST",
    body: body,
  });

  if (data.value) {
    await auth.fetchUser();
    uploading.value = false;
    toast.add({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
      life: 3000,
    });
  }
};

const handleProfileUpdate = async () => {
  const { data, error } = await useApiFetch("/api/profile/update", {
    method: "POST",
    body: form.value,
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
};

const isProfile = ref(true);
function onErrorClose() {
  errorMessage.value = null;
}

const selectedProfile = ref({
  name: "Update Profile",
  id: 1,
});

const profileOptions = ref([
  { name: "Update Profile", id: 1 },
  { name: "Change Password", id: 2 },
]);

watch(selectedProfile, (value) => {
  if (value.id === 1) {
    isProfile.value = true;
  } else {
    isProfile.value = false;
  }
});

definePageMeta({
  middleware: ["auth"],
});
</script>
<template>
  <!-- <div class="grid p-fluid"> -->
  <!-- <div class="flex justify-content-end">
    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
      <Button outlined label="Add New" icon="pi pi-plus" />
    </div>
  </div> -->
  <div class="flex justify-content-center">
    <div class="col-7">
      <div class="card card-w-title float-right">
        <SelectButton
          severity="secondary"
          outlined
          v-model="selectedProfile"
          :options="profileOptions"
          optionLabel="name"
        />
      </div>
      <div class="card" v-if="isProfile">
        <h5>Profile</h5>
        <div class="grid p-fluid">
          <div class="field col-12 md:col-12">
            <template v-if="auth.user.profile_img_url">
              <Image :src="auth.user.profile_img_url" alt="Image" width="250" />
            </template>
            <template>
              <Image
                src="https://primefaces.org/cdn/primevue/images/galleria/galleria7.jpg"
                alt="Image"
                width="250"
              />
            </template>
            <span class="image-upload p-float-label">
              <FileUpload
                ref="fileInput"
                mode="basic"
                accept="image/*"
                :maxFileSize="1000000"
                name="profile_img"
                :auto="true"
                :customUpload="true"
                @uploader="uploadHandler"
                @select="onPhotoSelect($event)"
              />
              <ProgressSpinner
                v-if="uploading"
                style="width: 30px; height: 30px"
              ></ProgressSpinner>
            </span>
          </div>
        </div>

        <div class="grid p-fluid">
          <div class="col-12 md:col-12">
            <Message severity="error" v-if="errorMessage" @close="onErrorClose">
              {{ errorMessage }}
            </Message>
            <form @submit.prevent="handleProfileUpdate">
              <div class="field col-12 md:col-12">
                <label for="state">Name</label>
                <InputText v-model="form.name" type="text" placeholder="Name" />
              </div>

              <div class="field col-12 md:col-12">
                <label for="state">Email</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-user" />
                  <InputText
                    v-model="form.email"
                    type="email"
                    placeholder="Email"
                  />
                </span>
              </div>

              <div class="field col-12 md:col-12">
                <label for="state">Roles</label>
                <Dropdown
                  id="state"
                  v-model="form.role"
                  :options="userRoles"
                  optionLabel="name"
                  placeholder="Select One"
                ></Dropdown>
              </div>

              <div class="field col-12 md:col-12">
                <Button type="submit" label="Submit" class="mr-2 mb-2"></Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="card" v-else>
        <div class="grid p-fluid">
          <div class="col-12 md:col-12">
            <Message severity="error" v-if="errorMessage" @close="onErrorClose">
              {{ errorMessage }}
            </Message>
            <form @submit.prevent="handleProfileUpdate">
              <div class="field col-12 md:col-12">
                <label for="state">New Password</label>
                <InputText
                  v-model="form.new_password"
                  type="text"
                  placeholder="New Password"
                />
              </div>

              <div class="field col-12 md:col-12">
                <label for="state">Confirm Password</label>
                <InputText
                  v-model="form.confirm_password"
                  type="text"
                  placeholder="Confirm Password"
                />
              </div>

              <div class="field col-12 md:col-12">
                <Button type="submit" label="Submit" class="mr-2 mb-2"></Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
.p-input-icon-left {
  width: 100%;
}
.image-upload {
  display: flex;
}
.p-progress-spinner {
  margin: 4px 0 !important;
}
</style>
