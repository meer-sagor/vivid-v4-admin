<script setup>
import { useLayout } from "./composables/layout";
import { computed } from "vue";
const { layoutConfig } = useLayout();
const logoUrl = computed(() => {
  return `/layout/images/${
    layoutConfig.darkTheme.value ? "logo-white" : "logo-white"
  }.svg`;
});

const year = new Date().getFullYear();
</script>

<template>
  <div class="layout-footer">
    <!-- <img :src="logoUrl" alt="Logo" height="20" class="mr-2" /> -->
    <span class="font-medium ml-2">Vividcustoms.com &#169;{{ year }}</span>
  </div>
</template>
<style lang="scss" scoped></style>
