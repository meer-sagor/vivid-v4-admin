<script lang="ts">
import { useToast } from "primevue/usetoast";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, FieldArray, Form, useForm } from "vee-validate";
import * as Yup from "yup";
import { useApiFetch } from "~/composables/useApiFetch";
import { useRouter } from "vue-router";
import add_faq_validation from "@/pages/pages/faqs/validation/add_faq_validation";
import add_faq_question_validation from "@/pages/pages/faqs/validation/add_faq_question_validation";

export default defineComponent({
  components: { Form, Field, ErrorMessage, FieldArray },
  setup() {
    const { handleSubmit, resetForm } = useForm();
    const toast = useToast();
    const loading = ref(false);
    const fetching = ref(false);
    const spinner = ref(false);
    const faq_pages = ref([]);
    const statuses = ref([]);
    const pages = ref([]);
    const faqValidationSchema = add_faq_validation;
    const faqQuestionValidationSchema = add_faq_question_validation;
    const router = useRouter();


    onMounted(async () => {
      await nextTick();
      await fetchCodes();
    });

    const faq = ref({
      title: "",
      status: "ENABLE",
      pages: [],
      faq_questions: [] as any
    });

    const faq_question = ref({
      question: '',
      answer: '',
      status: 'ENABLE',
    });

    const handleAnswerChange = (value: any) => {
      faq_question.value.answer = value;
    };

    // @ts-ignore
    const onSubmit = async (values, actions: { setErrors: (arg0: any) => void }) => {
      loading.value = true;

      const { data, error } = await useApiFetch("/api/faqs", {
        method: "POST",
        body: faq.value,
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

        await router.push({ path: "/pages/faqs" });
        resetModal();
      }
    };

    const saveFaqQuestion = () => {
      if (faq_question.value.answer == null || faq_question.value.answer == "") {
        toast.add({
          severity: "info",
          summary: "Danger",
          detail: "Answer is a required field",
          life: 3000,
        });
        return;
      }

      const newFaqPage = {
        question: faq_question.value.question,
        answer: faq_question.value.answer,
        status: faq_question.value.status,
      };

      faq.value.faq_questions.push(newFaqPage);
      resetModal();
      resetForm();
      createNewDialog.value = false
    }

    const removeFaqQuestion = (data:any, frozen:any, index:any) => {
      faq.value.faq_questions.splice(index, 1);
    }

    const updateFaqQuestion = (data:any, frozen:any, index:any) => {
      faq_question.value = {...data}
      createNewDialog.value = true
    }

    const fetchCodes = async () => {
      spinner.value = true;
      const { data, error } = await useApiFetch("/api/faq/codes", {
        method: "GET",
      });
      spinner.value = false;
      if (data.value) {
        fetching.value = true;
        const getCodes = JSON.parse(
          JSON.stringify(computed(() => data.value).value)
        );
        statuses.value = getCodes.statuses;
        pages.value = getCodes.pages;
      }
    };
    const createNewDialog = ref(false);

    const openNew = () => {
      createNewDialog.value = true;
      faq_question.value.question = ''
      faq_question.value.answer = ''
    };

    const resetModal = () => {
      const resetForm = document.getElementById(
        "add_faq_question_form"
      ) as HTMLFormElement;
      if (resetForm) {
        resetForm.reset();
      }
    };

    return {
      createNewDialog,
      toast,
      onSubmit,
      fetchCodes,
      faq,
      loading,
      spinner,
      fetching,
      resetModal,
      faq_question,
      faq_pages,
      statuses,
      pages,
      openNew,
      handleAnswerChange,
      saveFaqQuestion,
      faqValidationSchema,
      faqQuestionValidationSchema,
      removeFaqQuestion,
      updateFaqQuestion,
    };
  },
});
</script>

<template>
  <div>
    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <NuxtLink to="/pages/faqs">
        <Button
          icon="pi pi-angle-left"
          label="Go Back"
          class="p-button-text mr-2 mb-2"
        />
      </NuxtLink>
    </div>
    <template v-if="fetching">
      <Form id="add_product_form" @submit="onSubmit" :initial-values="faq" :validation-schema="faqValidationSchema" v-slot="{ values, errors }">
        <div class="grid">
          <div class="col-12">
            <div class="card p-fluid">
              <h5>Create FAQ</h5>

              <div class="grid">
                <div class="col-4">
                  <div class="field mt-4">
                    <label for="title">Title</label>
                    <Field
                      v-model="faq.title"
                      id="title"
                      name="title"
                      :class="{ 'p-invalid': errors.title }"
                      class="p-inputtext p-component"
                      aria-describedby="faq-title-error"
                      placeholder="Enter Title"
                    />
                    <small class="p-error" id="product-name-error">{{errors.title || "&nbsp;"}}</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="field mt-4">
                    <label for="status" class="mb-3">Status</label>
                    <Field name="status" v-slot="{ field }">
                      <Dropdown
                        v-bind="field"
                        id="status"
                        v-model="faq.status"
                        :options="statuses"
                        optionLabel="name"
                        optionValue="name"
                        placeholder="Select a Status"
                        display="chip"
                        :class="{ 'p-invalid': errors.status }"
                        aria-describedby="faq-status-error"
                      >
                      </Dropdown>
                    </Field>
                    <small class="p-error" id="product-status-error">{{errors.status || "&nbsp;"}}</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="field mt-4">
                    <label for="pages">Pages</label>
                    <Field name="pages" v-slot="{ field }">
                      <MultiSelect
                          v-bind="field"
                          v-model="faq.pages"
                          :options="pages"
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Select a pages"
                          display="chip"
                          :class="{ 'p-invalid': errors.pages }"
                          aria-describedby="associate-categories-error"
                      ></MultiSelect>
                    </Field>
                    <small class="p-error" id="associate-categories-error">{{ errors.pages || '&nbsp;' }}</small>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="card">
                  <div class="flex justify-content-between flex-column sm:flex-row mb-3">
                    <h4>Question & Answer</h4>

                    <Button
                        style="width: auto"
                        label="New"
                        @click="openNew"></Button>
                  </div>
                  <div class="field">
                    <DataTable :value="faq.faq_questions" tableStyle="min-width: 50rem">
                      <Column field="question" header="Question"></Column>
                      <Column field="answer" header="Answer">
                        <template #body="slotProps">
                          <span v-html="slotProps.data.answer"></span>
                        </template>
                      </Column>
                      <Column field="status" header="Status" :sortable="true">
                        <template #body="slotProps">
                          <span class="p-column-title">Status</span>
                          <span :class="'product-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                      </Column>
                      <Column header="Action" style="max-width: 50px">
                        <template #body="{ data, frozenRow, index }">
                            <span class="p-buttonset">
                              <Button
                                  icon="pi pi-pencil"
                                  class="p-button-text p-button-rounded mr-2"
                                  @click="updateFaqQuestion(data, frozenRow, index)"/>

                              <Button
                                  icon="pi pi-trash"
                                  severity="danger"
                                  class="p-button-text p-button-rounded"
                                  @click="removeFaqQuestion(data, frozenRow, index)"
                              />
                            </span>
                        </template>
                      </Column>
                    </DataTable>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="card p-fluid flex flex-column md:flex-row justify-content-end">
              <div class="field">
                <Button type="submit" style="min-width: 150px" label="Save" />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </template>

    <Dialog
      v-model:visible="createNewDialog"
      style="min-width: 600px"
      header="Add question & answer"
      :modal="true"
      class="p-fluid"
    >
      <Form
        id="add_faq_question_form"
        @submit="saveFaqQuestion"
        :initial-values="faq_question"
        :validation-schema="faqQuestionValidationSchema"
        v-slot="{ errors }">
        <div class="field">
          <label for="question">Question</label>
          <Field
            v-model="faq_question.question"
            id="question"
            name="question"
            :class="{ 'p-invalid': errors.question }"
            class="p-inputtext p-component"
            aria-describedby="faq-question-error"
            placeholder="Question"
          />
          <small class="p-error" id="faq-question-error">{{errors.question || "&nbsp;"}}</small>
        </div>

        <div class="field">
          <label for="answer">Answer</label>
          <ClientOnly>
            <QuillEditor
              ref="editor"
              v-model.content="faq_question.answer"
              theme="snow"
              content-type="html"
              :style="{ height: '200px' }"
              @update:content="handleAnswerChange"
            />
          </ClientOnly>
        </div>
        <div class="field">
          <label for="status" class="mb-3">Status</label>
          <Field name="status" v-slot="{ field }">
            <Dropdown
              :disabled="loading"
              v-bind="field"
              v-model="faq_question.status"
              :options="statuses"
              optionLabel="name"
              optionValue="name"
              placeholder="Select a status"
              display="chip"
              :class="{ 'p-invalid': errors.status }"
              aria-describedby="faq-page-status-error"
            ></Dropdown>
          </Field>
          <small class="p-error" id="faq-page-status-error">{{errors.status || "&nbsp;" }}</small>
        </div>

        <Button
          class=""
          type="submit"
          label="Submit"
          :loading="loading"
          icon="pi pi-check"
        />
      </Form>
    </Dialog>

    <div class="flex justify-content-center">
      <ProgressSpinner v-if="spinner" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/demo/styles/badges.scss";
</style>
