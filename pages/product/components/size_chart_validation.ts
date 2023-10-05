import * as Yup from "yup";

const size_chart_validation = Yup.object().shape({
        size_charts: Yup
            .array()
            .of(
                Yup.object().shape({
                        size_id: Yup.mixed().typeError('Size is a required field').required().label("Size"),
                        width: Yup.number().typeError('Width must be a number type').moreThan(0, "Width cannot be negative").max(1000).min(0).required().label("Width"),
                        length: Yup.number().typeError('Length must be a number type').moreThan(0, "Length cannot be negative").max(1000).min(0).required().label("Length"),
                    },
                )
            ),
    }
);

export default size_chart_validation