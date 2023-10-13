import * as Yup from "yup";

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
const add_banner_validation = Yup.object().shape({
    name: Yup.string().required().min(1).max(255).label("Name"),
    description: Yup.mixed().required().label("Description"),
    pages: Yup.mixed().required().label("Pages"),
    image: Yup.mixed().required().label("Image"),
    status: Yup.mixed().required().label("Status"),
}, [
    ['image', 'image'],
]);


export default add_banner_validation
