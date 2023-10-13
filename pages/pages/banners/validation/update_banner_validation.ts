import * as Yup from "yup";

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
const update_banner_validation = Yup.object().shape({
    name: Yup.string().required().min(1).max(255).label("Name"),
    description: Yup.string().required().min(1).max(255).label("Description"),
    status: Yup.mixed().required().label("Status"),
}, [
    ['image', 'image'],
]);


export default update_banner_validation
