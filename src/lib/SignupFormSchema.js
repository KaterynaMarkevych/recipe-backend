import * as Yup from "yup";

export const SignupFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters long.")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email.")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter.")
    .matches(/[0-9]/, "Password must contain at least one number.")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character."
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
import * as yup from "yup";

export const SignupFormSchemaStep1 = yup.object().shape({
  name: yup.string().required("Введіть ім’я"),
  email: yup.string().email("Некоректний email").required("Email обов’язковий"),
  password: yup
    .string()
    .min(6, "Мінімум 6 символів")
    .required("Пароль обов’язковий"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Паролі не співпадають")
    .required("Підтвердіть пароль"),
});

export const SignupFormSchemaStep2 = yup.object().shape({
  avatar: yup
    .mixed()
    .test("fileType", "Файл повинен бути зображенням", (value) => {
      if (!value || value.length === 0) return true; // дозволити відсутність файлу
      return value[0].type.startsWith("image/");
    }),
  bio: yup
    .string()
    .notRequired() // необов’язкове поле
    .test("bio-length", "Біо занадто коротке", (value) => {
      if (!value || value.trim() === "") {
        return true; // якщо пусто — пропускаємо
      }
      return value.trim().length >= 5; // інакше мінімум 5 знаків
    }),
});
