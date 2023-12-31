<template>
  <div class="card">
    <h5>Edit Customers</h5>
    <template v-if="fetching">
      <Form id="add_associate_form" @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
        <div class="flex flex-column gap-2 mb-1">
          <label for="first_name">First Name</label>
          <Field v-model="associate.first_name" id="first_name" name="first_name" :class="{ 'p-invalid': errors.first_name }" class="p-inputtext p-component" aria-describedby="associate-first-name-error" placeholder="First name"/>
          <small class="p-error" id="associate-first-name-error">{{ errors.first_name || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="last_name">Last Name</label>
          <Field v-model="associate.last_name" id="last_name" name="last_name" :class="{ 'p-invalid': errors.last_name }" class="p-inputtext p-component" aria-describedby="associate-last-name-error" placeholder="Last name"/>
          <small class="p-error" id="associate-last-name-error">{{ errors.first_name || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="username">User Name</label>
          <Field v-model="associate.username" id="username" name="username" :class="{ 'p-invalid': errors.username }" class="p-inputtext p-component" aria-describedby="associate-username" placeholder="User name"/>
          <small class="p-error" id="associate-last-name-error">{{ errors.username || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="email">Email</label>
          <Field v-model="associate.email" id="email" name="email" :class="{ 'p-invalid': errors.email }" class="p-inputtext p-component" aria-describedby="associate-email-error" placeholder="Email address"/>
          <small class="p-error" id="associate-email-error">{{ errors.email || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-1">
          <label for="phone">User Phone</label>
          <Field v-model="associate.phone" id="phone" name="phone" :class="{ 'p-invalid': errors.phone }" class="p-inputtext p-component" aria-describedby="associate-phone-error" placeholder="User phone"/>
          <small class="p-error" id="associate-phone-error">{{ errors.phone || '&nbsp;' }}</small>
        </div>
        <div class="flex flex-column gap-2 mb-3">
          <label for="dob">Date of Birth</label>
          <Calendar v-model="associate.dob" dateFormat="yy-mm-dd" showIcon/>
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
import {useImageUpload} from "@/components/image/useImageUpload.js";
import {useRoute,useRouter} from "vue-router";

export default defineComponent({
  components: {Form, Field},
  setup() {
    const {handleSubmit, resetForm} = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const userRoles = ref([]);
    const files = ref();
    const route = useRoute();
    const router = useRouter();

    const associate = ref({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: "",
      phone:'',
      dob: "",
      username:"",
    });

    let {imageFile, imageUrl, handleImageSelected} = useImageUpload();

    const schema = Yup.object().shape({
      first_name: Yup.string().required().min(2).max(100).label("First name"),
      last_name: Yup.string().required().min(2).max(100).label("Last name"),
      username: Yup.string().required().min(2).max(100).label("User name"),
      email: Yup.string().email().required().min(2).max(100).label("Email"),
      phone: Yup.string().nullable().transform((v, o) => (o === '' ? null : v)).typeError('Phone no. is a number field')
          .test('is-digit-range', 'Phone no. must have between 8 and 16 digits', value => {
            if (!value) return true; // Allow empty values
            const numericValue = parseInt(value, 10);
            return numericValue >= 10 ** 7 && numericValue <= 10 ** 16;
          }).label("Phone"),
    });

    onMounted(async () => {
      spinner.value = true
      await nextTick();
      await fetchRoles();
      await fetchAssociates();
      spinner.value = false
      fetching.value = true
    });

    const fetchRoles = async () => {
      // spinner.value = true
      // const {data, error} = await useApiFetch("/api/associate/getRoles", {
      //   method: "GET",
      // });
      // spinner.value = false
      // if (data.value) {
      //   fetching.value = true
      //   const getRoles = JSON.parse(JSON.stringify(computed(() => data.value).value))
      //   userRoles.value = getRoles.roles;
      // }
    };

    const fetchAssociates = async () => {
      const {data, error} = await useApiFetch("/api/customers/" + route.params.id + '/edit', {
        method: "GET",
      });
      if (data.value) {
        const getUsers = JSON.parse(JSON.stringify(computed(() => data.value).value))
        associate.value = getUsers.customer;
      }
    };

    const onSubmit = async (values: any, actions: { setErrors: (arg0: any) => void; }) => {
      console.log('test');
      
      loading.value = true
      const body = new FormData();
      body.append("first_name", associate.value.first_name);
      body.append("last_name", associate.value.last_name);
      body.append("username", associate.value.username);
      body.append("email", associate.value.email);
      // body.append("password", associate.value.password);
      body.append("phone",  associate.value.phone);
      body.append("dob",  new Date(associate.value.dob).toISOString().slice(0, 10));
      // body.append("image", imageFile.value);


      const {data, error} = await useApiFetch("/api/customers/update/" + route.params.id, {
        method: "POST",
        body: body,
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
        await router.push({ path: "/customers" });

        resetModal();
        resetForm()
      }

    };

    const resetModal = () => {
      const resetForm = document.getElementById('add_associate_form') as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      schema, onSubmit, associate, loading, userRoles, fetching, spinner, resetModal, handleImageSelected
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

.form-control[type=file]:not(:disabled):not([readonly]) {
  cursor: pointer;
}

.form-control[type=file] {
  overflow: hidden;
}
.form-control {
  color: #92929f;
  background-color: #1e1e2d;
  border: 1px solid #323248;
  box-shadow: none !important;
}
.form-control {
  display: block;
  width: 100%;
  padding: 0.75rem 0.75rem;;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.5;
  color: #5E6278;
  background-color: #ffffff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.475rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.form-control.p-invalid {
  border-color: #f1416c;
  padding-right: calc(1.5em + 1.55rem);
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.3875rem) center;
  background-size: calc(0.75em + 0.775rem) calc(0.75em + 0.775rem);
}
</style>
