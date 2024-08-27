import * as yup from "yup";

export const basicSchema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});
