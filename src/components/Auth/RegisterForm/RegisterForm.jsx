"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupFormSchema } from "@/lib/SignupFormSchema";
import axios from "axios";
import styles from "./RegisterForm.module.scss";

export default function RegisterForm({ onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupFormSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      console.log(response.data);
      // тут можна зробити редірект на логін, або показати повідомлення про успішну реєстрацію
      window.location.href = "/newprofile";
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Помилка реєстрації");
      console.error("Помилка реєстрації:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <button type="button" onClick={onBack} className={styles.link}>
        ←
      </button>
      <h2 className={styles.title}>Реєстрація</h2>

      <input
        type="text"
        {...register("name")}
        placeholder="Ім'я"
        className={styles.input}
      />
      <p className={styles.error}>{errors.name?.message}</p>

      <input
        type="email"
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

      <button type="submit" className={styles.button}>
        Зареєструватися
      </button>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
}
