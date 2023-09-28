<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <Galleria :value="medias" :responsiveOptions="responsiveOptions" :numVisible="7"
                  containerStyle="max-width: 850px" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
          <template #item="slotProps">
            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
          </template>
        </Galleria>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from "vue";
import { useMediaStore } from "@/stores/useMediaStore";
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const mediaStore = useMediaStore();
const search = ref(null);
const medias = ref([]);
const categories = ref([]);

const fetchMedias = async () => {
  await mediaStore.getMedias();
  if (mediaStore.medias) {
    medias.value = mediaStore.medias;
  }
};

const fetchMediaCategories = async () => {
  await mediaStore.getMediaCategories();
  if (mediaStore.categories) {
    categories.value = mediaStore.categories;
  }
};

onMounted(async () => {
  await nextTick();
  await fetchMedias();
  await fetchMediaCategories();
});

</script>

