"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  SignupFormSchemaStep1,
  SignupFormSchemaStep2,
} from "@/lib/SignupFormSchema";
import { uploadToCloudinary } from "@/scripts/uploadToCloudinary";
import axios from "axios";
import styles from "./RegisterForm.module.scss";

export default function RegisterForm({ onBack }) {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      step === 1 ? SignupFormSchemaStep1 : SignupFormSchemaStep2
    ),
  });

  const onSubmitStep1 = (data) => {
    setStep1Data(data);
    setStep(2);
  };

  const onSubmitStep2 = async (data) => {
    const fullData = {
      ...step1Data,
      username: data.username,
      bio: data.bio,
    };

    let avatarUrl = "";

    if (avatarFile) {
      // завантажуємо файл на Cloudinary
      avatarUrl = await uploadToCloudinary(avatarFile);
    }

    const formData = new FormData();
    Object.entries(fullData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // додаємо avatarUrl до даних, які відправляємо на сервер
    formData.append("avatar", avatarUrl);

    try {
      const response = await axios.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username,
        bio: data.bio || "", // біо може бути порожнім
        avatar: avatarUrl || "", // аватар може бути порожнім
      });
      console.log(response.data);
      window.location.href = `/profile/${session.user.id}`;
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Помилка реєстрації");
      console.error("Помилка реєстрації:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(step === 1 ? onSubmitStep1 : onSubmitStep2)}
      className={styles.form}
    >
      <button type="button" onClick={onBack} className={styles.link}>
        ←
      </button>
      <h2 className={styles.title}>Реєстрація: крок {step}</h2>

      {step === 1 && (
        <>
          <input
            {...register("name")}
            placeholder="Ім’я (буде загaльно доступним)"
            className={styles.input}
          />
          <p className={styles.error}>{errors.name?.message}</p>

          <input
            {...register("email")}
            placeholder="Email"
            className={styles.input}
          />
          <p className={styles.error}>{errors.email?.message}</p>

          <input
            type="password"
            {...register("password")}
            placeholder="Пароль"
            className={styles.input}
          />
          <p className={styles.error}>{errors.password?.message}</p>

          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Підтвердіть пароль"
            className={styles.input}
          />
          <p className={styles.error}>{errors.confirmPassword?.message}</p>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className={styles.input}
          />
          <p className={styles.error}>{errors.avatar?.message}</p>

          <textarea
            {...register("bio")}
            placeholder="Коротко про себе"
            className={styles.input}
          />
          <p className={styles.error}>{errors.bio?.message}</p>

          <button
            type="button"
            onClick={() => setStep(1)}
            className={styles.link}
          >
            ← Назад
          </button>
        </>
      )}

      <button type="submit" className={styles.button}>
        {step === 1 ? "Далі" : "Завершити реєстрацію"}
      </button>
    </form>
  );
}
