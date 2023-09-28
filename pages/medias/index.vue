<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <div class="mb-4">
          <form action="" @submit.prevent="onSearch">
            <div class="flex flex-row gap-3">
              <div class="col-3 mb-0">
                <div class="flex flex-column gap-2 mb-0">
                  <Dropdown
                      v-model="search_data.type"
                      :options="media_types"
                      optionLabel="name"
                      optionValue="name"
                      placeholder="Select a media type"
                      display="chip"
                  >
                  </Dropdown>
                </div>
              </div>
              <div class="col-3 mb-0">
                <div class="flex flex-column gap-2 mb-0">
                  <Dropdown
                      v-model="search_data.category"
                      :options="categories"
                      optionLabel="name"
                      optionValue="name"
                      placeholder="Select a category"
                      display="chip"
                  ></Dropdown>
                </div>
              </div>
              <div class="col-3 mb-0">
                <div class="flex flex-column gap-2 mb-0">
                  <InputText
                      id="name"
                      v-model.trim="search_data.name"
                      autofocus
                      placeholder="Enter name"
                  />
                </div>
              </div>
              <div class="col-2 mb-0">
                <div class="flex flex-column gap-2 mb-0">
                  <Button class="" type="submit" label="Submit" :loading="loading" icon="pi pi-search"/>
                </div>
              </div>
            </div>
          </form>
        </div>
        <template v-if="fetching">
          <Galleria v-model:activeIndex="activeIndex" v-model:visible="displayCustom" :value="medias" :responsiveOptions="responsiveOptions" :numVisible="7"
                    containerStyle="max-width: 850px" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
            <template #item="slotProps">
              <img :src="slotProps.item.url" :alt="slotProps.item.type" style="width: 100%; display: block" />
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item.url" :alt="slotProps.item.type" style="display: block" />
            </template>
          </Galleria>
          <div v-if="medias" class="grid">
            <div v-for="(image, index) of medias" :key="index" class="col-3 flex flex-column align-content-center justify-content-center">
              <img :src="image.url" :alt="image.type"  style="max-width: 200px; cursor: pointer" class="rounded flex justify-content-center" @click="imageClick(index)"/>
              <Badge :value="image.type" class="mt-2" severity="info" style="border-radius: 6px !important;max-width: 200px"></Badge>
              <span class="mt-2 mb-2">{{ image.file_size }} KB</span>
            </div>
          </div>
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
import { useApiFetch } from "@/composables/useApiFetch";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const mediaStore = useMediaStore();
const search = ref(null);
const medias = ref([]);
const categories = ref([]);
const media_types = ref([]);
const fetching = ref(false);
const spinner = ref(false);
const activeIndex = ref(0);
const displayCustom = ref(false);
const loading = ref(false);

const search_data = ref({
  type: "",
  category: "",
  name: "",
});

const fetchMedias = async () => {
  spinner.value = true;
  await mediaStore.getMedias();
  spinner.value = false;
  if (mediaStore.medias) {
    fetching.value = true;
    medias.value = mediaStore.medias;
  }
};

const fetchMediaCategories = async () => {
  await mediaStore.getMediaCategories();
  if (mediaStore.categories) {
    categories.value = mediaStore.categories;
    let valueNullObject = { id: '', name: '' }
    categories.value.unshift(valueNullObject);

  }
};

const fetchMediaTypes = async () => {
  await mediaStore.getMediaTypes();
  if (mediaStore.media_types) {
    media_types.value = mediaStore.media_types;
    let valueNullObject = { id: '', name: '' }
    media_types.value.unshift(valueNullObject);
  }
};

const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};

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

const onSearch = async () => {
  console.log(search_data.value)
  const {data, error} = await useApiFetch("/api/images/search", {
    method: "POST",
    body: search_data.value,
  });
  loading.value = false;

  const data_obj = JSON.parse(JSON.stringify(computed(() => data.value).value));
  if (data.value) {
    medias.value = data_obj.medias
  }
}

onMounted(async () => {
  await nextTick();
  await fetchMedias();
  await fetchMediaCategories();
  await fetchMediaTypes();
});

</script>

