import * as Yup from "yup";

const add_child_product_validation = Yup.object().shape({
    color_id: Yup.mixed().required().typeError('Color is a required field').label("Color"),
    fabric_id: Yup.mixed().required().typeError('Fabric is a required field').label("Fabric"),
    quantity: Yup.number().required().typeError('Quantity is a required field').label("Quantity"),
    status: Yup.mixed().required().label("Status"),
    sizes: Yup.mixed().required().label("Sizes"),
})


export default add_child_product_validation
