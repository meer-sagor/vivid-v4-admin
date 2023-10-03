<script setup>
definePageMeta({
  middleware: ["auth"],
});
import AppLayout from "@/layouts/AppLayout.vue";
</script>

<template>
  <app-layout></app-layout>
</template>
