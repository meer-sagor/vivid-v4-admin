<template>
  <div class="card">
    <h5>Add Role</h5>
    <template v-if="fetching">
      <Form id="add_role_form" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
        <div class="flex flex-column gap-2 mb-1">
          <label for="name">Role Name</label>
          <Field v-model="role.name" id="name" name="name" :class="{ 'p-invalid': errors.name }" class="p-inputtext p-component" aria-describedby="role-name-error" placeholder="Role name"/>
          <small class="p-error" id="role-name-error">{{ errors.name || '&nbsp;' }}</small>
        </div>
        <div v-if="permissions.length > 0" class="flex flex-column gap-2 mb-3">
          <label for="permissions">Permissions</label>
          <div class="col-md-12">
            <div class="flex flex-column sm:flex-row justify-content-between">
              <div v-for="(permission, index) in permissions" :key="index" class="flex align-items-center">
                <Field type="checkbox" v-model="role.permissions" :value="permission.id" :id="'permission'+index"
                       name="permissions" :class="{ 'p-invalid': errors.permissions }" class="p-checkbox p-component"
                       binary aria-describedby="permissions-error"/>
                <label :for="permission.name" class="ml-2"> {{ permission.name }} </label>
              </div>
            </div>
            <div class="col-md-12">
              <small class="p-error" id="permissions-error">{{ errors.permissions || '&nbsp;' }}</small>
            </div>
          </div>
        </div>
        <Button class="" type="submit" label="Submit" :loading="loading" icon="pi pi-check"/>
      </Form>
    </template>
    <div class="flex justify-content-center">
      <ProgressSpinner v-if="spinner"/>
    </div>
  </div>
</template>

<script lang="ts">
import {useToast} from 'primevue/usetoast';
import {Field, Form, useField, useForm} from 'vee-validate';
import {ref, defineComponent, nextTick, onMounted} from "vue";
import * as Yup from "yup";
import {useApiFetch} from "~/composables/useApiFetch";
import {useRoute} from "vue-router";

export default defineComponent({
  components: {Form, Field},
  setup() {
    const {handleSubmit, resetForm} = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const permissions = ref([]);
    const route = useRoute();
    console.log(route.params)

    const role = ref({
      name: "",
      guard_name: "api",
      permissions: []
    });

    const schema = Yup.object({
      name: Yup.string().required().min(2).max(15).label("Role Name"),
      permissions: Yup.array().required().min(1).label("Permissions"),
    });

    onMounted(async () => {
      await nextTick();
      await fetchPermissions();
      await fetchRoles();
    });

    const fetchPermissions = async () => {
      spinner.value = true
      const {data, error} = await useApiFetch("/api/role/get-permissions", {
        method: "GET",
      });
      spinner.value = false
      if (data.value) {
        fetching.value = true
        const getPermissions = JSON.parse(JSON.stringify(computed(() => data.value).value))
        permissions.value = getPermissions.permissions;
      }
    };

    const fetchRoles = async () => {
      const {data, error} = await useApiFetch("/api/roles/" + route.params.id + '/edit', {
        method: "GET",
      });
      if (data.value) {
        const getRoles = JSON.parse(JSON.stringify(computed(() => data.value).value))
        role.value = getRoles.role;
      }
    };


    const onSubmit = async (values: any, actions: { setErrors: (arg0: any) => void; }) => {
      loading.value = true
      const {data, error} = await useApiFetch("/api/roles/" + route.params.id, {
        method: "PUT",
        body: role.value,
      });
      loading.value = false
      const data_obj = JSON.parse(JSON.stringify(computed(() => data.value).value))
      const error_obj = JSON.parse(JSON.stringify(computed(() => error.value).value))

      if (error_obj && Object.keys(error_obj).length > 0) {
        const errorList = error_obj.data.errors;
        actions.setErrors(errorList);
      }

      if (data.value) {
       const message = JSON.parse(JSON.stringify(computed(() => data_obj.message).value));
       toast.add({
          severity: "info",
          summary: "Success",
          detail: message,
          life: 3000,
        });

        resetModal();
        resetForm()
      }

    };

    const resetModal = () => {
      const resetForm = document.getElementById('add_role_form') as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      schema, onSubmit, role, loading, permissions, fetching, spinner, resetModal
    }

  }
})

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
