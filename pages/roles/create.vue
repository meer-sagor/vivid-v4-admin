<template>
  <div class="card">
    <h5>Add Role</h5>
    <template v-if="fetching">
      <Form id="add_role_form" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
          <div class="col-6 mb-0">
              <div class="flex flex-column gap-2">
                <label for="name">Role Name</label>
                <Field
                  v-model="role.name"
                  id="name"
                  name="name"
                  :class="{ 'p-invalid': errors.name }"
                  class="p-inputtext p-component"
                  aria-describedby="role-name-error"
                  placeholder="Role name"
                />
                <small class="p-error" id="role-name-error">{{errors.name || "&nbsp;"}}</small>
              </div>
          </div>
         <div class="col-12">
           <div v-if="permissions.length > 0">
             <label for="permissions">Permissions</label>
             <div class="col-12" style="margin-bottom: 0px !important;">
               <div v-for="(permission, index) in permissions" :key="index">
                 <div v-for="(menu, key) in permission" :key="key" class="align-items-center mb-3">
                   <h6 style="margin-bottom: 4px !important;">{{ key }}</h6>
                   <span  class="flex flex-column sm:flex-row justify-content-between">
                      <span v-for="(single_menu, index) in menu" :key="index" class="flex align-items-center">
                      <Field
                          type="checkbox"
                          v-model="role.permissions"
                          :value="single_menu.id"
                          :id="'single_menu' + key"
                          name="permissions"
                          :class="{ 'p-invalid': errors.permissions }"
                          class="p-checkbox p-component"
                          binary
                          aria-describedby="permissions-error"
                      />
                      <label :for="single_menu.name" class="ml-2">{{ single_menu.name }}</label>
                    </span>
                    </span>
                 </div>
               </div>
               <small class="p-error" id="permissions-error">{{errors.permissions || "&nbsp;"}}</small>
             </div>
           </div>
         </div>
        <Button class="" type="submit" label="Submit" :loading="loading" icon="pi pi-check"/>
      </Form>
    </template>
    <div class="flex justify-content-center">
      <ProgressSpinner v-if="spinner" />
    </div>
  </div>
</template>

<script lang="ts">
import { useToast } from "primevue/usetoast";
import { Field, Form, useField, useForm } from "vee-validate";
import { ref, defineComponent, nextTick, onMounted } from "vue";
import * as Yup from "yup";
import { useApiFetch } from "~/composables/useApiFetch";
import {useRouter} from "vue-router";

export default defineComponent({
  components: { Form, Field },
  setup() {
    const { handleSubmit, resetForm } = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const permissions = ref([]);
    const router = useRouter();

    const permissionMenus = ref([
      { label: "Promo Code", value: "promo_code" },
      { label: "Manage Sections", value: "manage_sections" },
    ]);

    const selectedMenu = ref(null);

    const selectedPermissions = ref(null);

    const role = ref({
      name: "",
      guard_name: "web",
      permissions: [],
    });

    const schema = Yup.object({
      name: Yup.string().required().min(2).max(15).label("Role Name"),
      permissions: Yup.array().required().min(1).label("Permissions"),
    });

    onMounted(async () => {
      await nextTick();
      await fetchPermissions();
    });

    const fetchPermissions = async () => {
      spinner.value = true;
      const { data, error } = await useApiFetch("/api/role/get-permissions", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getPermissions = JSON.parse(JSON.stringify(computed(() => data.value).value));
        permissions.value = getPermissions.permissions;

      }
    };

    const onSubmit = async (
      values: any,
      actions: { setErrors: (arg0: any) => void }
    ) => {
      loading.value = true;
      const { data, error } = await useApiFetch("/api/roles", {
        method: "POST",
        body: role.value,
      });
      loading.value = false;
      const data_obj = JSON.parse(
        JSON.stringify(computed(() => data.value).value)
      );
      const error_obj = JSON.parse(
        JSON.stringify(computed(() => error.value).value)
      );

      if (error_obj && Object.keys(error_obj).length > 0) {
        const errorList = error_obj.data.errors;
        actions.setErrors(errorList);
      }

      if (data.value) {
        const message = JSON.parse(
          JSON.stringify(computed(() => data_obj.message).value)
        );
        toast.add({
          severity: "info",
          summary: "Success",
          detail: message,
          life: 3000,
        });

        await router.push({ path: "/roles" });
        resetModal();
        resetForm();
      }
    };

    const resetModal = () => {
      const resetForm = document.getElementById(
        "add_role_form"
      ) as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      schema,
      onSubmit,
      role,
      loading,
      permissions,
      fetching,
      spinner,
      resetModal,
      permissionMenus,
      selectedMenu,
      selectedPermissions,
    };
  },
});
</script>
<style scoped>
.p-checkbox {
  width: 18px !important;
  height: 18px !important;
}

.p-checkbox.p-invalid.p-component {
  border-color: #e24c4c;
}

.p-checkbox.p-invalid {
  border-color: #e24c4c;
}
</style>
