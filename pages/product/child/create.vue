<script setup>
import { onMounted, ref } from "vue";
const listboxValues = ref([
  { name: "NB", code: "NY" },
  { name: "0M", code: "RM" },
  { name: "3M", code: "LDN" },
  { name: "6M", code: "IST" },
  { name: "12M", code: "PRS" },
]);
const listboxValue = ref(null);
const checkboxValue1 = ref([]);
const checkboxValue2 = ref([]);
const checkboxValue3 = ref([]);
const checkboxValue4 = ref([]);
</script>

<template>
  <div class="card mb-4">
    <h5>Filter</h5>
    <div class="flex justify-content-between flex-column sm:flex-row gap-3">
      <Dropdown
        v-model="dropdownValue"
        :options="dropdownValues"
        optionLabel="Color *"
        label="ok"
        placeholder="Select"
        style="width: 100%"
      />
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
        </span>
        <InputText placeholder="Fabric *" />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <i class="pi pi-user"></i>
        </span>
        <InputText placeholder="Min Quanity" />
      </div>
      <Dropdown
        v-model="dropdownValue"
        :options="dropdownValues"
        optionLabel="Visibility *"
        placeholder="Select"
        style="width: 100%"
      />
      <Dropdown
        v-model="dropdownValue"
        :options="dropdownValues"
        optionLabel="Status *"
        placeholder="Select"
        style="width: 100%"
      />
    </div>
  </div>
  <div class="grid p-fluid">
    <div class="col-12 md:col-3">
      <div class="card text-center mb-3">
        <h5 class="mb-4">Catalog Image *</h5>
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
        <Listbox
          v-model="listboxValue"
          :options="listboxValues"
          optionLabel="name"
          :filter="true"
        />
      </div>
    </div>
    <div class="col-12 md:col-9">
      <div class="card text-center mb-3">
        <div class="grid p-fluid">
          <div class="col-12 md:col-3">
            <div class="card">
              <h5 class="mb-4">Front Side</h5>
              <div class="mb-3">
                <img
                  src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                  alt=""
                  height="100"
                />
              </div>
              <div class="flex gap-3">
                <div class="field-checkbox mb-0">
                  <Checkbox
                    id="checkOption1"
                    v-model="checkboxValue1"
                    name="option"
                    value="Chicago"
                  />
                </div>
                <FileUpload
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
                <img
                  src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                  alt=""
                  height="100"
                />
              </div>
              <div class="flex gap-3">
                <div class="field-checkbox mb-0">
                  <Checkbox
                    id="checkOption1"
                    v-model="checkboxValue1"
                    name="option"
                    value="Chicago"
                  />
                </div>
                <FileUpload
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
                <img
                  src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                  alt=""
                  height="100"
                />
              </div>
              <div class="flex gap-3">
                <div class="field-checkbox mb-0">
                  <Checkbox
                    id="checkOption1"
                    v-model="checkboxValue1"
                    name="option"
                    value="Chicago"
                  />
                </div>
                <FileUpload
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
                <img
                  src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                  alt=""
                  height="100"
                />
              </div>
              <div class="flex gap-3">
                <div class="field-checkbox mb-0">
                  <Checkbox
                    id="checkOption1"
                    v-model="checkboxValue1"
                    name="option"
                    value="Chicago"
                  />
                </div>
                <FileUpload
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
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
