<script setup>
import { ProductService } from "@/service/ProductService";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";

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

const handleChange = (value) => {
  description = value;
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
    class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
  >
    <NuxtLink to="/product">
      <Button
        icon="pi pi-angle-left"
        label="Go Back"
        class="p-button-text mr-2 mb-2"
      />
    </NuxtLink>
  </div>

  <div class="grid">
    <div class="col-8">
      <div class="card p-fluid">
        <h5>Create Product</h5>
        <div class="field mt-4">
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
          <ClientOnly>
            <QuillEditor
              ref="editor"
              v-model.content="description"
              theme="snow"
              content-type="html"
              :style="{ height: '200px' }"
              @update:content="handleChange"
            />
          </ClientOnly>
        </div>

        <div class="field">
          <label for="name" class="mb-3">Size Chart Description</label>
          <ClientOnly>
            <QuillEditor
              ref="editor"
              v-model.content="chartDescription"
              theme="snow"
              content-type="html"
              :style="{ height: '200px' }"
              @update:content="handleChange"
            />
          </ClientOnly>
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
      </div>
    </div>

    <div class="col-4">
      <div class="card p-fluid">
        <div class="field">
          <label for="name">Primary Image</label>
          <FileUpload
            name="demo[]"
            @uploader="onUpload"
            accept="image/*"
            :maxFileSize="1000000"
            customUpload
            class="p-button-outlined"
          />
        </div>

        <div class="field">
          <label for="name">Additional Images</label>
          <FileUpload
            name="demo[]"
            @uploader="onUpload"
            :multiple="true"
            accept="image/*"
            :maxFileSize="1000000"
            customUpload
            class="p-button-outlined"
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

    <div class="col-8">
      <div class="card">
        <div class="field">
          <div
            class="formgrid"
            style="
              border: 1px solid #e4e4e4;
              border-radius: 12px;
              padding: 16px;
            "
          >
            <div>
              <div
                class="flex justify-content-between flex-column sm:flex-row mb-3"
              >
                <h4>Size Chart</h4>
                <div>
                  <Button
                    label="Add"
                    icon="pi pi-plus"
                    class="mr-2 mb-2"
                  ></Button>
                </div>
              </div>
              <table style="width: 100%; text-align: left">
                <thead>
                  <tr>
                    <th>Sizes</th>
                    <th>Width</th>
                    <th>Length</th>
                    <th>Remove</th>
                    <th>Up/Down</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <InputText type="text" placeholder="Default"></InputText>
                    </td>
                    <td>
                      <InputText type="text" placeholder="Default"></InputText>
                    </td>
                    <td>
                      <InputText type="text" placeholder="Default"></InputText>
                    </td>
                    <td>
                      <i class="pi pi-times"></i>
                    </td>
                    <td>
                      <Button
                        icon="pi pi-sort-alt"
                        class="p-button-rounded p-button-text mr-2 mb-2"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="flex justify-content-between flex-column sm:flex-row mb-3">
          <h4>Price Shirt Chart</h4>
          <div>
            <Button label="Add" icon="pi pi-plus" class="mr-2 mb-2"></Button>
          </div>
        </div>

        <div class="field">
          <div
            class="formgrid"
            style="
              border: 1px solid #e4e4e4;
              border-radius: 12px;
              padding: 16px;
            "
          >
            <table style="width: 100%; text-align: left">
              <thead>
                <tr>
                  <th>Sizes</th>
                  <th>Range From</th>
                  <th>Range To</th>
                  <th>Price</th>
                  <th>Remove</th>
                  <th class="text-center">Up/Down</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Infant Colors</td>
                  <td>
                    <InputText type="text" placeholder="Default"></InputText>
                  </td>
                  <td>
                    <InputText type="text" placeholder="Default"></InputText>
                  </td>
                  <td>
                    <InputText type="text" placeholder="Default"></InputText>
                  </td>
                  <td>
                    <Button
                      icon="pi pi-times"
                      class="p-button-rounded p-button-text mr-2 mb-2"
                    />
                  </td>
                  <td class="text-center">
                    <Button
                      icon="pi pi-arrow-up"
                      class="p-button-rounded p-button-text mr-2 mb-2"
                    />

                    <Button
                      icon="pi pi-arrow-down"
                      class="p-button-rounded p-button-text mr-2 mb-2"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Infant White</td>
                  <td>
                    <InputText type="text" placeholder="Default"></InputText>
                  </td>
                  <td>
                    <InputText type="text" placeholder="Default"></InputText>
                  </td>
                  <td>
                    <InputText type="text" placeholder="Default"></InputText>
                  </td>
                  <td>
                    <Button
                      icon="pi pi-times"
                      class="p-button-rounded p-button-text mr-2 mb-2"
                    />
                  </td>
                  <td class="text-center">
                    <Button
                      icon="pi pi-arrow-up"
                      class="p-button-rounded p-button-text mr-2 mb-2"
                    />

                    <Button
                      icon="pi pi-arrow-down"
                      class="p-button-rounded p-button-text mr-2 mb-2"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="field">
          <div
            class="formgrid"
            style="
              border: 1px solid #e4e4e4;
              border-radius: 12px;
              padding: 16px;
            "
          >
            <div>
              <div
                class="flex justify-content-between flex-column sm:flex-row mb-3"
              >
                <div>
                  <h4 class="mb-0">Select and add picture for print area</h4>
                </div>
              </div>
              <div class="grid p-fluid">
                <div class="col-12 md:col-12">
                  <div class="grid p-fluid text-center">
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
                        <div class="flex justify-content-center gap-3">
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
                        <div class="flex justify-content-center gap-3">
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
                        <div class="flex justify-content-center gap-3">
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
                        <div class="flex justify-content-center gap-3">
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
          </div>
        </div>
        <div class="field">
          <div
            class="formgrid"
            style="
              border: 1px solid #e4e4e4;
              border-radius: 12px;
              padding: 16px;
            "
          >
            <div>
              <ClothCustom />
            </div>
          </div>
        </div>
      </div>
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
          />
        </div>
        <div class="field">
          <Button style="min-width: 150px" label="Save" @click="saveProduct" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
