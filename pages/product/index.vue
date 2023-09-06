<script setup>
import { CountryService } from "@/service/CountryService";
import { NodeService } from "@/service/NodeService";
import { onMounted, ref } from "vue";

const floatValue = ref(null);
const countries = ref();
const selectedCountry = ref();
const filteredCountries = ref();
const calendarValue = ref(null);
const inputNumberValue = ref(null);
const chipsValue = ref(null);
const sliderValue = ref(50);
const ratingValue = ref(null);
const colorValue = ref("#1976D2");
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const listboxValues = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);
const listboxValue = ref(null);
const dropdownValues = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);
const dropdownValue = ref(null);
const multiselectValues = ref([
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

const multiselectValue = ref(null);
const toggleValue = ref(false);
const selectButtonValue1 = ref(null);
const selectButtonValues1 = ref([
  { name: "Option 1" },
  { name: "Option 2" },
  { name: "Option 3" },
]);
const selectButtonValue2 = ref(null);
const selectButtonValues2 = ref([
  { name: "Option 1" },
  { name: "Option 2" },
  { name: "Option 3" },
]);
const knobValue = ref(50);
const inputGroupValue = ref(false);
const treeSelectNodes = ref(null);
const selectedNode = ref(null);

onMounted(() => {
  CountryService.getCountries().then((data) => (countries.value = data));
  NodeService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

const searchCountry = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCountries.value = [...countries.value];
    } else {
      filteredCountries.value = countries.value.filter((country) => {
        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
};
</script>
<template>
  <div class="grid p-fluid">
    <div class="col-8 md:col-8">
      <div class="card">
        <h5>InputText</h5>
        <div class="grid formgrid">
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <InputText type="text" placeholder="Default"></InputText>
          </div>
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <InputText
              type="text"
              placeholder="Disabled"
              :disabled="true"
            ></InputText>
          </div>
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <InputText type="text" placeholder="Invalid" class="p-invalid" />
          </div>
        </div>

        <h5>Icons</h5>
        <div class="grid formgrid">
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <InputText type="text" placeholder="Username" />
            </span>
          </div>
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <span class="p-input-icon-right">
              <InputText type="text" placeholder="Search" />
              <i class="pi pi-search" />
            </span>
          </div>
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <span class="p-input-icon-left p-input-icon-right">
              <i class="pi pi-user" />
              <InputText type="text" placeholder="Search" />
              <i class="pi pi-search" />
            </span>
          </div>
        </div>

        <h5>Float Label</h5>
        <span class="p-float-label">
          <InputText id="username" v-model="floatValue" type="text" />
          <label for="username">Username</label>
        </span>

        <h5>Textarea</h5>
        <Textarea
          placeholder="Your Message"
          :autoResize="true"
          rows="3"
          cols="30"
        />

        <h5>AutoComplete</h5>
        <AutoComplete
          v-model="selectedCountry"
          optionLabel="name"
          :suggestions="filteredCountries"
          @complete="searchCountry"
          multiple
        />

        <h5>Calendar</h5>
        <Calendar
          v-model="calendarValue"
          :showIcon="true"
          :showButtonBar="true"
        ></Calendar>

        <h5>Spinner</h5>
        <InputNumber
          v-model="inputNumberValue"
          showButtons
          mode="decimal"
        ></InputNumber>

        <h5>Chips</h5>
        <Chips v-model="chipsValue" />
      </div>
    </div>

    <div class="col-4 md:col-4">
      <div class="card">
        <div class="grid">
          <div class="col-12">
            <h5>Slider</h5>
            <InputText v-model.number="sliderValue" />
            <Slider v-model="sliderValue" />
          </div>
          <div class="col-12 md:col-6">
            <h5>Rating</h5>
            <Rating v-model="ratingValue" />
          </div>
          <div class="col-12 md:col-6">
            <h5>ColorPicker</h5>
            <ColorPicker v-model="colorValue" style="width: 2rem" />
          </div>
          <div class="col-12">
            <h5>Knob</h5>
            <Knob
              v-model="knobValue"
              :step="10"
              :min="-50"
              :max="50"
              valueTemplate="{value}%"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
