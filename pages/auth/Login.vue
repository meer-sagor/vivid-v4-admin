<script setup>
import { useLayout } from "@/layouts/composables/layout";
import { ref, computed } from "vue";
// import AppConfig from "@/layouts/AppConfig.vue";
import { useAuthStore } from "@/stores/useAuthStore";

definePageMeta({
  layout: false,
  middleware: ["guest"],
});

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
  return `/layout/images/${
    layoutConfig.darkTheme.value ? "logo-white" : "logo-white"
  }.svg`;
});

const loading = ref(false);
const errorMessage = ref("");
const checked = ref(false);

const auth = useAuthStore();

const form = ref({
  email: "admin@vividcustoms.com",
  password: "password",
});

async function handleLogin() {
  loading.value = true;
  console.log("is logged in", auth.isLoggedIn);
  if (auth.isLoggedIn) {
    return navigateTo("/");
  } else {
    const { error } = await auth.login(form.value);
    loading.value = false;

    errorMessage.value = null;

    if (error.value) {
      errorMessage.value = error.value.data.message;
    } else {
      await navigateTo({ path: "/" });
    }
  }
}

function onErrorClose() {
  errorMessage.value = null;
}
</script>

<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <NuxtLink to="/">
        <img
          :src="logoUrl"
          alt="Vividcustoms.com"
          class="mb-5 w-15rem flex-shrink-0"
        />
      </NuxtLink>
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color) 10%,
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="w-full surface-card py-8 px-5 sm:px-8"
          style="border-radius: 53px"
        >
          <div class="text-center mb-5">
            <!-- <img
              src="/demo/images/login/avatar.png"
              alt="Image"
              height="50"
              class="mb-3"
            /> -->
            <div class="text-900 text-3xl font-medium mb-3">
              Welcome to Admin Panel
            </div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <Message severity="error" v-if="errorMessage" @close="onErrorClose">
              {{ errorMessage }}</Message
            >

            <label for="email1" class="block text-900 text-xl font-medium mb-2"
              >Email</label
            >
            <InputText
              id="email1"
              v-model="form.email"
              type="text"
              placeholder="Email address"
              class="w-full md:w-30rem mb-5"
              :class="errorMessage ? 'p-invalid' : ''"
              style="padding: 1rem"
            />

            <label
              for="password1"
              class="block text-900 font-medium text-xl mb-2"
              >Password</label
            >
            <Password
              id="password1"
              v-model="form.password"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-3"
              :class="errorMessage ? 'p-invalid' : ''"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
            ></Password>

            <div
              class="flex align-items-center justify-content-between mb-5 gap-5"
            >
              <div class="flex align-items-center">
                <Checkbox
                  id="rememberme1"
                  v-model="checked"
                  binary
                  class="mr-2"
                ></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div>
              <a
                class="font-medium no-underline ml-2 text-right cursor-pointer"
                style="color: var(--primary-color)"
                >Forgot password?</a
              >
            </div>
            <Button
              :loading="loading"
              type="submit"
              label="Sign In"
              class="w-full p-3 text-xl"
            ></Button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- <AppConfig simple /> -->
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}
.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

.login-form {
  max-width: 420px;
}
</style>
