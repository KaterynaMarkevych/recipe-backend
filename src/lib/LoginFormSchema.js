import * as Yup from "yup";

export const LoginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email.")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required"),
});
