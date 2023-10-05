import * as Yup from "yup";

const priceShirtChartSchema =  Yup.object().shape({
        price_category_id: Yup.string().typeError('Sizes is a required field').required().label("Sizes"),
        range_from: Yup.number().typeError('Range from must be a number type').moreThan(0, "Range from cannot be negative").max(1000).min(0).required().label("Range from"),
        range_to: Yup.number().typeError('Range to must be a number type').moreThan(0, "Range to cannot be negative").max(1000).min(0).required().label("Range to"),
        price: Yup.number().typeError('Price must be a number type').moreThan(0, "Price cannot be negative").max(1000).min(0).required().label("Price"),
    }
);

const sizeChartSchema =  Yup.object().shape({
        size_id: Yup.mixed().typeError('Size is a required field').required().label("Size"),
        width: Yup.number().typeError('Width must be a number type').moreThan(0, "Width cannot be negative").max(1000).min(0).required().label("Width"),
        length: Yup.number().typeError('Length must be a number type').moreThan(0, "Length cannot be negative").max(1000).min(0).required().label("Length"),
    },
)

const add_product_validation = Yup.object().shape({
    name: Yup.string().required().min(1).max(255).label("Name"),
    url_key: Yup.string().required().min(1).max(255).label("URL Key"),
    style_number: Yup.string().required().min(1).max(255).label("Style Number"),
    sku: Yup.string().required().min(1).max(255).label("SKU"),
    default_printing: Yup.boolean().required().label("Default printing"),
    default_embroidery: Yup.boolean().required().label("Default embroidery"),
    quantity: Yup.number().required().typeError('Quantity is a required field').label("Quantity"),
    fabric_id: Yup.mixed().required().typeError('Fabric is a required field').label("Fabric"),
    category_id: Yup.mixed().required().typeError('Category is a required field').label("Category"),
    sub_category_id: Yup.mixed().required().typeError('Sub Category is a required field').label("Sub Category"),
    brand_id: Yup.mixed().required().typeError('Brand is a required field').label("Brand"),
    price_shirt_charts: Yup.array().of(priceShirtChartSchema).min(1),
    size_charts: Yup.array().of(sizeChartSchema).min(1),
})


export default add_product_validation
