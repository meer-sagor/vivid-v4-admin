<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "primevue/usetoast";
import { apiURL, baseURL } from "@/config/environment";
import { useApiFetch } from "@/composables/useApiFetch";
import { ref } from "vue";
const toast = useToast();
const auth = useAuthStore();

const form = ref({
  first_name: auth.user.first_name,
  last_name: auth.user.last_name,
  old_email: auth.user.email,
  email: auth.user.email,
  password: "",
  password_confirmation: "",
});

const fileInput = ref(null);
const files = ref();
const uploading = ref(false);
const errorMessage = ref("");

const onPhotoSelect = ($event) => {
  files.value = fileInput.value?.files;
};

const uploadHandler = async (event) => {
  uploading.value = true;
  const fileUp = event.files[0];
  const body = new FormData();
  body.append("image", fileUp);

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

const handlePasswordUpdate = async () => {
  const { data, error } = await useApiFetch("/api/profile/password/update", {
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

    form.value.password = ''
    form.value.password_confirmation = ''
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
            <template v-if="auth.user.media?.url">
              <Image :src="auth.user.media?.url" alt="Image" width="250" />
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
              <ProgressSpinner v-if="uploading" style="width: 30px; height: 30px"></ProgressSpinner>
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
                <label for="first_name">First Name</label>
                <InputText v-model="form.first_name" type="text" placeholder="First name" />
              </div>
              <div class="field col-12 md:col-12">
                <label for="last_name">Last Name</label>
                <InputText v-model="form.last_name" type="text" placeholder="Last name" />
              </div>
              <div class="field col-12 md:col-12">
                <label for="email">Email</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-user" />
                  <InputText v-model="form.email" type="email" placeholder="Email"/>
                </span>
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
            <form @submit.prevent="handlePasswordUpdate">
              <div class="field col-12 md:col-12">
                <label for="password">New Password</label>
                <InputText v-model="form.password" type="password" placeholder="New Password"/>
              </div>

              <div class="field col-12 md:col-12">
                <label for="password_confirmation">Confirm Password</label>
                <InputText v-model="form.password_confirmation" type="password" placeholder="Confirm Password"/>
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
