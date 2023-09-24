<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";
import TipTap from "@/components/TipTap.vue";

const description = ref(null);
const chartDescription = ref(null);

const editorValue = ref(description, chartDescription);
function resetText() {
  editorValue.value = startText;
}

const toast = useToast();

const products = ref(null);

const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const switchValue = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const submitted = ref(false);
const statuses = ref([
  { label: "Enable", value: "enable" },
  { label: "Disable", value: "disable" },
]);

const categories = ref([
  { label: "T Shirt", value: "tshirt" },
  { label: "Disable", value: "disable" },
]);

onMounted(() => {
  ProductService.getProducts().then((data) => (products.value = data));
});

const formatCurrency = (value) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

const saveProduct = () => {
  submitted.value = true;

  if (product.value.name && product.value.name.trim() && product.value.price) {
    if (product.value.id) {
      product.value.inventoryStatus = product.value.inventoryStatus.value
        ? product.value.inventoryStatus.value
        : product.value.inventoryStatus;
      products.value[findIndexById(product.value.id)] = product.value;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });
    } else {
      product.value.id = createId();
      product.value.code = createId();
      product.value.image = "product-placeholder.svg";
      product.value.inventoryStatus = product.value.inventoryStatus
        ? product.value.inventoryStatus.value
        : "Enable";
      products.value.push(product.value);
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Created",
        life: 3000,
      });
    }

    productDialog.value = false;
    product.value = {};
  }
};

const editProduct = (editProduct) => {
  product.value = { ...editProduct };
  console.log(product);
  productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
  product.value = editProduct;
  deleteProductDialog.value = true;
};

const deleteProduct = () => {
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Product Deleted",
    life: 3000,
  });
};

const findIndexById = (id) => {
  let index = -1;

  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
};

const createId = () => {
  let id = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
};

const onUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};
</script>

<template>
  <div
    class="card flex flex-column md:flex-row md:justify-content-between md:align-items-center"
  >
    <NuxtLink to="/product">
      <Button
        icon="pi pi-angle-left"
        label="Go Back"
        class="p-button-text mr-2 mb-2"
      />
    </NuxtLink>
    <h5>Create Product</h5>
  </div>
  <div class="grid">
    <div class="col-8">
      <div class="card p-fluid">
        <div class="field">
          <label for="name">Name</label>
          <InputText
            id="name"
            v-model.trim="product.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !product.name }"
          />
          <small v-if="submitted && !product.name" class="p-invalid"
            >Name is required.</small
          >
        </div>

        <div class="formgrid grid">
          <div class="field col">
            <label for="inventoryStatus" class="mb-3">URL Key</label>
            <InputText
              id="name"
              v-model.trim="product.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid"
              >Name is required.</small
            >
          </div>
          <div class="field col">
            <label for="name" class="mb-3">Style Number</label>
            <InputText
              id="name"
              v-model.trim="product.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid"
              >Name is required.</small
            >
          </div>
        </div>

        <div class="formgrid grid md:align-items-center">
          <div class="field col">
            <label for="name" class="mb-3">SKU</label>
            <InputText
              id="name"
              v-model.trim="product.name"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid"
              >Name is required.</small
            >
          </div>
          <div class="field col">
            <label for="name" class="mb-3">Quantity</label>
            <InputText
              id="name"
              type="number"
              value="0"
              v-model.trim="product.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small v-if="submitted && !product.name" class="p-invalid"
              >Name is required.</small
            >
          </div>
        </div>

        <div class="field">
          <label for="name" class="mb-3">Description</label>
          <TipTap v-model="description" />
        </div>

        <div class="field">
          <label for="name" class="mb-3">Size Chart Description</label>
          <TipTap v-model="chartDescription" />
        </div>

        <div class="field">
          <label for="inventoryStatus" class="mb-3">Status</label>
          <Dropdown
            id="inventoryStatus"
            v-model="product.inventoryStatus"
            :options="statuses"
            optionLabel="label"
            placeholder="Select a Status"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span
                  :class="'product-badge status-' + slotProps.value.value"
                  >{{ slotProps.value.label }}</span
                >
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span
                  :class="
                    'product-badge status-' + slotProps.value.toLowerCase()
                  "
                  >{{ slotProps.value }}</span
                >
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
        </div>

        <div class="col-12">
          <div
            class="card p-fluid flex flex-column md:flex-row md:justify-content-between md:align-items-center"
          >
            <div class="field">
              <Button
                style="min-width: 150px"
                label="Cancel"
                class="p-button-text"
                @click="hideDialog"
              />
            </div>
            <div class="field">
              <Button
                style="min-width: 150px"
                label="Save"
                @click="saveProduct"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-4">
      <div class="card p-fluid">
        <div class="field">
          <label for="name">Images</label>
          <FileUpload
            name="demo[]"
            @uploader="onUpload"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
            customUpload
          />
        </div>

        <div class="field col">
          <label for="categories" class="mb-3">Category</label>
          <Dropdown
            id="categories"
            v-model="product.categories"
            :options="categories"
            optionLabel="label"
            placeholder="Select a Category"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span
                  :class="'product-badge status-' + slotProps.value.value"
                  >{{ slotProps.value.label }}</span
                >
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span
                  :class="
                    'product-badge status-' + slotProps.value.toLowerCase()
                  "
                  >{{ slotProps.value }}</span
                >
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <label for="Sub-category" class="mb-3">Sub-category</label>
          <Dropdown
            id="Sub-category"
            v-model="product.subCategories"
            :options="subCategories"
            optionLabel="label"
            placeholder="Select a Category"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span
                  :class="'product-badge status-' + slotProps.value.value"
                  >{{ slotProps.value.label }}</span
                >
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span
                  :class="
                    'product-badge status-' + slotProps.value.toLowerCase()
                  "
                  >{{ slotProps.value }}</span
                >
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <label for="inventoryStatus" class="mb-3">Fabric</label>
          <Dropdown
            id="inventoryStatus"
            v-model="product.inventoryStatus"
            :options="statuses"
            optionLabel="label"
            placeholder="Select a Fabric"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span
                  :class="'product-badge status-' + slotProps.value.value"
                  >{{ slotProps.value.label }}</span
                >
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span
                  :class="
                    'product-badge status-' + slotProps.value.toLowerCase()
                  "
                  >{{ slotProps.value }}</span
                >
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <label for="inventoryStatus" class="mb-3">Brand</label>
          <Dropdown
            id="inventoryStatus"
            v-model="product.inventoryStatus"
            :options="statuses"
            optionLabel="label"
            placeholder="Select a Brand"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span
                  :class="'product-badge status-' + slotProps.value.value"
                  >{{ slotProps.value.label }}</span
                >
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span
                  :class="
                    'product-badge status-' + slotProps.value.toLowerCase()
                  "
                  >{{ slotProps.value }}</span
                >
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
        </div>

        <div class="field col">
          <div class="formgrid grid">
            <div class="field col">
              <label for="name" class="flex mb-3">Default Printing</label>
              <InputSwitch v-model="defaultPrinting" />
            </div>
            <div class="field col">
              <label for="name" class="flex mb-3">Default Embroidery</label>
              <InputSwitch v-model="defaultEmbroidery" />
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
