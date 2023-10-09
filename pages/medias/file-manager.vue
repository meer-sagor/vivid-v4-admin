<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <template v-if="fetching">
          <file-manager></file-manager>
        </template>
        <div class="flex justify-content-center">
          <ProgressSpinner v-if="spinner" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from "vue";
import { useMediaStore } from "@/stores/useMediaStore";
import FileManager from 'laravel-file-manager'
import { useToast } from "primevue/usetoast";
const toast = useToast();
const mediaStore = useMediaStore();
const medias = ref([]);
const fetching = ref(false);
const spinner = ref(false);
const loading = ref(false);

const fetchMedias = async () => {
  spinner.value = true;
  await mediaStore.getMedias();
  spinner.value = false;
  if (mediaStore.medias) {
    fetching.value = true;
    medias.value = mediaStore.medias;
  }
};


onMounted(async () => {
  await nextTick();
  await fetchMedias();
});

</script>

