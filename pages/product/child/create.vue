<script setup>
import { onMounted, ref } from "vue";
const listboxValues = ref([
  { name: "NB", code: "NY" },
  { name: "0M", code: "RM" },
  { name: "3M", code: "LDN" },
  { name: "6M", code: "IST" },
  { name: "12M", code: "PRS" },
]);

const dropdownValue = ref(null);
const status = ref(null);

const dropdownValues = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);

const selectedCountry = ref();
const countries = ref([
  { name: "Australia", code: "AU" },
  { name: "Brazil", code: "BR" },
  { name: "China", code: "CN" },
  { name: "Egypt", code: "EG" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "India", code: "IN" },
  { name: "Japan", code: "JP" },
  { name: "Spain", code: "ES" },
  { name: "United States", code: "US" },
]);

const statusOptions = ref([
  { name: "Enable", code: "Enable" },
  { name: "Disable", code: "Disable" },
]);

const checkboxValue1 = ref([]);
const multiselectValue = ref(null);

const multiselectValues = ref([
  { name: "XL", code: "XL" },
  { name: "M", code: "M" },
  { name: "L", code: "L" },
]);
</script>

<template>
  <div class="card mb-4">
    <h5>Filters</h5>
    <div class="flex justify-content-between flex-column sm:flex-row gap-3">
      <Dropdown
        style="min-width: 250px"
        v-model="selectedCountry"
        :options="countries"
        optionLabel="name"
        placeholder="Color"
        class="w-full md:w-14rem"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <img
              :alt="slotProps.value.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
              style="width: 18px"
            />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <img
              :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`"
              style="width: 18px"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>

      <Dropdown
        v-model="dropdownValue"
        :options="dropdownValues"
        optionLabel="name"
        placeholder="Fabric"
        style="width: 100%"
      />
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
        </span>
        <InputText type="number" placeholder="Min Quanity" />
      </div>
      <Dropdown
        v-model="status"
        :options="statusOptions"
        optionLabel="name"
        placeholder="Status"
        style="width: 100%"
      />
    </div>
  </div>
  <div class="grid p-fluid">
    <div class="col-12 md:col-3">
      <div class="card text-center mb-3">
        <h5 class="mb-4">Catalog Image</h5>
        <FileUpload
          mode="basic"
          name="demo[]"
          accept="image/*"
          :maxFileSize="1000000"
          @uploader="onUpload"
          customUpload
        />
      </div>
      <div class="card mb-3">
        <h5 class="mb-4">Sizes</h5>

        <MultiSelect
          v-model="multiselectValue"
          :options="multiselectValues"
          optionLabel="name"
          placeholder="Select Sizes"
        >
          <template #value="slotProps">
            <div
              v-for="option of slotProps.value"
              :key="option.code"
              class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2"
            >
              <span
                :class="'mr-2 flag flag-' + option.code.toLowerCase()"
                style="width: 18px; height: 12px"
              />
              <div>{{ option.name }}</div>
            </div>
            <template v-if="!slotProps.value || slotProps.value.length === 0">
              <div class="p-1">Select Sizes</div>
            </template>
          </template>
        </MultiSelect>
      </div>
    </div>
    <div class="col-12 md:col-9">
      <div class="card text-center mb-3">
        <div class="grid p-fluid">
          <div class="col-12 md:col-3">
            <div class="card text-center">
              <h5 class="mb-4">Front Side</h5>
              <div class="mb-3">
                <img src="/images/placeholder.svg" alt="" height="100" />
              </div>
              <div class="flex gap-3 flex justify-content-center">
                <FileUpload
                  class="file-upload-btn"
                  mode="basic"
                  name="demo[]"
                  accept="image/*"
                  :maxFileSize="1000000"
                  @uploader="onUpload"
                  customUpload
                />
              </div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="card">
              <h5 class="mb-4">Right Side</h5>
              <div class="mb-3">
                <img src="/images/placeholder.svg" alt="" height="100" />
              </div>
              <div class="flex gap-3 flex justify-content-center">
                <FileUpload
                  class="file-upload-btn"
                  mode="basic"
                  name="demo[]"
                  accept="image/*"
                  :maxFileSize="1000000"
                  @uploader="onUpload"
                  customUpload
                />
              </div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="card">
              <h5 class="mb-4">Back Side</h5>
              <div class="mb-3">
                <img src="/images/placeholder.svg" alt="" height="100" />
              </div>
              <div class="flex gap-3 flex justify-content-center">
                <FileUpload
                  class="file-upload-btn"
                  mode="basic"
                  name="demo[]"
                  accept="image/*"
                  :maxFileSize="1000000"
                  @uploader="onUpload"
                  customUpload
                />
              </div>
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="card">
              <h5 class="mb-4">Left Side</h5>
              <div class="mb-3">
                <img src="/images/placeholder.svg" alt="" height="100" />
              </div>
              <div class="flex gap-3 flex justify-content-center">
                <!-- <div class="field-checkbox mb-0">
                  <Checkbox
                    id="checkOption1"
                    v-model="checkboxValue1"
                    name="option"
                    value="Chicago"
                  />
                </div> -->
                <FileUpload
                  class="file-upload-btn"
                  mode="basic"
                  name="demo[]"
                  accept="image/*"
                  :maxFileSize="1000000"
                  @uploader="onUpload"
                  customUpload
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div
        class="card flex flex-column md:flex-row md:justify-content-between md:align-items-center"
      >
        <div class="field">
          <Button
            style="min-width: 150px"
            label="Cancel"
            class="p-button-text"
          />
        </div>
        <div class="field">
          <Button type="submit" style="min-width: 150px" label="Save" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
