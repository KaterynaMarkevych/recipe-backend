"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormSchema } from "@/lib/LoginFormSchema";
import styles from "./LoginForm.module.scss";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";

export default function LoginForm({ onRegisterClick }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(LoginFormSchema) });

  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    setLoginError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setLoginError("Невірний email або пароль");
    } else {
      const session = await getSession();
      if (session?.user?.id) {
        window.location.href = `/profile/${session.user.id}`;
      } else {
        setLoginError("Помилка отримання сесії");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>Увійти</h2>

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

      {loginError && <p className={styles.error}>{loginError}</p>}

      <button type="submit" className={styles.button}>
        Увійти
      </button>

      <div className={styles.footer}>
        <button type="button" onClick={onRegisterClick} className={styles.link}>
          Зареєструватися
        </button>
      </div>
    </form>
  );
}
