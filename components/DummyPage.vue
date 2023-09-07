<script setup>
const route = useRoute();

definePageMeta({
  middleware: ["auth"],
});
</script>
<template>
  <div class="flex justify-content-center">
    <div class="col-7">
      <div class="card">{{ route.name }} Content goes here</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
