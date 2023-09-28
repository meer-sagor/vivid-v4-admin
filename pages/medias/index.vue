<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <div v-if="medias" class="grid" style="max-width: 400px">
          <div v-for="(image, index) of medias" :key="index" class="col-4">
            <img :src="image.url" :alt="image.type"/>
          </div>
        </div>
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
const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 5
  },
  {
    breakpoint: '768px',
    numVisible: 3
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
]);

const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};

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

