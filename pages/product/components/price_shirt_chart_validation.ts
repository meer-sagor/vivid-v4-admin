import * as Yup from "yup";

const price_shirt_chart_validation = Yup.object().shape({
        price_shirt_charts: Yup
            .array()
            .of(
                Yup.object().shape({
                        price_category_id: Yup.string().typeError('Sizes is a required field').required().label("Sizes"),
                        range_from: Yup.number().typeError('Range from must be a number type').moreThan(0, "Range from cannot be negative").max(1000).min(0).required().label("Range from"),
                        range_to: Yup.number().typeError('Range to must be a number type').moreThan(0, "Range to cannot be negative").max(1000).min(0).required().label("Range to"),
                        price: Yup.number().typeError('Price must be a number type').moreThan(0, "Price cannot be negative").max(1000).min(0).required().label("Price"),
                    }
                )
            ),
    }
);

export default price_shirt_chart_validation
