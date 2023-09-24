<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "./composables/layout";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const { layoutConfig, onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const auth = useAuthStore();
const user = ref(auth.user ? auth.user : null);

console.log("auth.user", auth.user);

onMounted(() => {
  bindOutsideClickListener();
});
onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const greeting = computed(() => {
  const d = new Date();
  const time = d.getHours();
  if (time < 12) {
    return "Good morning";
  }
  if (time > 12) {
    return "Good afternoon";
  }
  if (time == 12) {
    return "It's time for lunch";
  }
});

const logoUrl = computed(() => {
  // return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
  return `/layout/images/${
    layoutConfig.darkTheme.value ? "logo-white" : "logo-white"
  }.svg`;
});

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };

    document.addEventListener("click", outsideClickListener.value);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};

const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;
  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};

// Logout
const handleLogout = async () => {
  await auth.logout();
};

const onLogout = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to logout?",
    acceptClass: "p-button-danger",
    accept: () => {
      toast.add({
        severity: "error",
        summary: "Confirmed",
        detail: "You are being logged out...",
        life: 1000,
      });

      setTimeout(() => {
        handleLogout();
      }, 1000);
    },
  });
};

const userProfile = () => {
  if (auth.isLoggedIn) {
    return navigateTo("/profile");
  }
};

const onSettingsClick = () => {
  if (auth.isLoggedIn) {
    return navigateTo("/roles");
  }
};
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img :src="logoUrl" alt="logo" />
      <span style="color: var(--blue-800); font-size: 16px">ADMINISTRATOR</span>
    </router-link>

    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle()"
    >
      <i class="pi pi-bars"></i>
    </button>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      @click="onTopBarMenuButton()"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button> -->
      <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button> -->

      <Toast />
      <ConfirmPopup></ConfirmPopup>
      <div
        style="
          display: inline-flex;
          justify-content: center;
          align-items: center;
        "
      >
        {{ greeting }}&nbsp;<strong>
          {{ user.first_name + " " + user.last_name }}!
        </strong>
      </div>
      <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-cog"></i>
        <span>Settings</span>
      </button>
      <button class="p-link layout-topbar-button" @click="userProfile">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <button @click="onLogout" class="p-link layout-topbar-button">
        <i class="pi pi-power-off"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
