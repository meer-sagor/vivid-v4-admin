<template>
  <Dialog
    v-model:visible="showModal"
    :style="{ width: '60vw' }"
    header="Insert Media "
    :modal="true"
  >
    <TabView>
      <TabPanel header="Upload Files">
        <div class="field">
          <FileUpload
            ref="fileInput"
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            customUpload
            @select="onPhotoSelect($event)"
          />

          <span class="p-invalid" v-if="imageError">{{ imageError }}</span>
          <br />
          <img
            v-if="files"
            :src="files[0].objectURL"
            :alt="files[0].objectURL"
            class="shadow-2"
            width="200"
          />
          <img
            v-else-if="fileData"
            :src="fileData"
            :alt="fileData"
            class="shadow-2"
            width="200"
          />
        </div>
      </TabPanel>

      <TabPanel header="Media Library">
        <div class="grid">
          <div class="col-12">
            <Listbox
              class="media-file-folders"
              v-model="fileFolder"
              :options="fileFolders"
              optionLabel="name"
              :filter="true"
            />
          </div>

          <div class="col-12">
            <div class="card">
              <div class="grid">
                <div class="col-4">
                  <Image
                    src="/demo/images/galleria/galleria11.jpg"
                    alt="Image"
                    width="300"
                    preview
                  />
                  <div
                    style="max-width: 300px"
                    class="flex align-items-center justify-content-between mt-2"
                  >
                    <Button
                      icon="pi pi-copy"
                      class="p-button-rounded p-button-outlined"
                    />
                    <Button
                      style="min-width: 250px"
                      label="Select"
                      class="p-button-outlined"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <Image
                    src="/demo/images/galleria/galleria11.jpg"
                    alt="Image"
                    width="300"
                    preview
                  />
                  <div
                    style="max-width: 300px"
                    class="flex align-items-center justify-content-between mt-2"
                  >
                    <Button
                      icon="pi pi-copy"
                      class="p-button-rounded p-button-outlined"
                    />
                    <Button
                      style="min-width: 250px"
                      class="p-button-outlined p-button-success"
                      label="Selected"
                      icon="pi pi-check"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
    <template #footer>
      <Button
        label="Insert into post"
        class="p-button p-component p-button-primary mr-2 mb-2"
      />
    </template>
  </Dialog>
</template>

<script setup>
const emit = defineEmits(["close"]);
const props = defineProps({
  mediaModal: {
    type: Boolean,
    required: true,
  },
});
const { mediaModal } = props;

const showModal = ref(false);

const fileData = ref();
const fileFolder = ref(null);
const fileFolders = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
  { name: "Paris", code: "PRS" },
]);

const files = ref();

const onPhotoSelect = ($event) => {
  product.value.image_id == null;
  files.value = fileInput.value?.files;
  imageError.value = null;
  console.log(files.value[0].objectURL);
};

watch(showModal, (value) => {
  if (!value) {
    emit("close", true);
  }
});

watch(
  () => props.mediaModal,
  (value) => {
    if (value) {
      showModal.value = true;
    } else {
      showModal.value = false;
    }
  }
);
</script>
