<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();

const products = ref(null);
const fabrics = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'Enable', value: 'enable' },
    { label: 'Disable', value: 'disable' },
]);

onMounted( async () => {
    // ProductService.getProducts().then((data) => (products.value = data));
    await initialize();
});
const initialize = async () => {
  const { data, error } = await useApiFetch("/api/fabrics/", {
    method: "GET",
  });
  console.log(data,'calling');
    // errorMessage.value = null;
    // if (error.value) {
    //   errorMessage.value = error.value.data.message;
    // }
    if (data.value) {
    //   console.log(data.value.brands);
    fabrics.value = data.value.fabrics;
    //   totalData.value  = data.value.roles.total
    }
}
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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

const saveProduct = async () => {
    submitted.value = true;
    console.log(product.value);
    if (product.value.name && product.value.name.trim()) {
        product.value.status = product.value.status.value ? product.value.status.value : product.value.status;
        if (product.value.id) {
            // product.value.status = product.value.status.value ? product.value.status.value : product.value.status;
            const { data, error } = await useApiFetch("/api/fabrics/" + product.value.id, {
                method: "PUT",
                body: product.value,
            });
            // errorMessage.value = null;
            // if (error.value) {
            // errorMessage.value = error.value.data.message;
            // }
            if (data.value) {
                toast.add({
                    severity: "info",
                    summary: "Success",
                    detail: data.value.message,
                    life: 3000,
                });
            }
            products.value[findIndexById(product.value.id)] = product.value;
            // toast.add({
            //     severity: 'success',
            //     summary: 'Successful',
            //     detail: 'Product Updated',
            //     life: 3000
            // });
        } else {
            const { data, error } = await useApiFetch("/api/fabrics", {
                method: "POST",
                body: product.value,
            });
            if (data.value) {
                toast.add({
                    severity: "info",
                    summary: "Success",
                    detail: data.value.message,
                    life: 3000,
                });
            }
            // product.value.id = createId();
            // product.value.code = createId();
            // product.value.image = 'product-placeholder.svg';
            // product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'Enable';
            products.value.push(product.value);
            // toast.add({
            //     severity: 'success',
            //     summary: 'Successful',
            //     detail: 'Product Created',
            //     life: 3000
            // });
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

const deleteProduct = async () => {
    const { data, error } = await useApiFetch("/api/brands/" + product.value.id, {
      method: "DELETE",
    });
    // errorMessage.value = null;
    // if (error.value) {
    //   errorMessage.value = error.value.data.message;
    // }
    if (data.value) {
      toast.add({
        severity: "success",
        summary: "Product Deleted",
        detail: data.value.message,
        life: 3000,
      });
    }
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    // toast.add({
    //     severity: 'success',
    //     summary: 'Successful',
    //     detail: 'Product Deleted',
    //     life: 3000
    // });
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
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Products Deleted',
        life: 3000
    });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <DataTable
                    ref="dt"
                    v-model:selection="selectedProducts"
                    :value="fabrics"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                >
                    <template #paginatorstart>
                        <Button type="button" icon="pi pi-refresh" text @click="initialize" />
                    </template>
                    <template #paginatorend>
                        <Button type="button" icon="pi pi-download" text />
                    </template>
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h3 class="m-0">Fabrics</h3>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            </div>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="quality" header="Quality" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Quality</span>
                            {{ slotProps.data.quality }}
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span :class="'product-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <Column field="updated_at" header="Updated_at" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Updated_at</span>
                            {{ slotProps.data.updated_at }}
                        </template>
                    </Column>
                    <Column class="text-right">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Edit Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{ 'p-invalid': submitted && !product.name }" />
                        <small v-if="submitted && !product.name" class="p-invalid">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="quality">Quality</label>
                        <InputText id="quality" v-model.trim="product.quality" required="true" autofocus :class="{ 'p-invalid': submitted && !product.quality }" />
                        <small v-if="submitted && !product.quality" class="p-invalid">Name is required.</small>
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Status</label>
                        <Dropdown id="inventoryStatus" v-model="product.status" :options="statuses" optionLabel="label" placeholder="Select a Status">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>