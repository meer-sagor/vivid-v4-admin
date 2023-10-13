import * as Yup from "yup";

const add_faq_question_validation = Yup.object().shape({
    question: Yup.string().required().min(1).max(255).label("Question"),
    status: Yup.mixed().required().label("Status"),
});


export default add_faq_question_validation
