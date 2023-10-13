import * as Yup from "yup";

const add_faq_validation = Yup.object().shape({
    title: Yup.string().required().min(1).max(255).label("Title"),
    pages: Yup.mixed().required().label("Pages"),
    status: Yup.mixed().required().label("Status"),
});


export default add_faq_validation
