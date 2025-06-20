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
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import styles from "./RegisterForm.module.scss";

const RegisterForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(
      step === 1 ? SignupFormSchemaStep1 : SignupFormSchemaStep2
    ),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      bio: "",
    },
  });

  const handleNextStep = async () => {
    const isValid = await trigger([
      "name",
      "email",
      "password",
      "confirmPassword",
    ]);

    if (isValid) {
      setStep(2);
    }
  };
  //avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (data) => {
    if (step === 1) {
      handleNextStep();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let avatarUrl = "";

      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile);
      }

      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username,
        bio: data.bio || "",
        avatar: avatarUrl || "",
      };

      const response = await axios.post("/api/auth/register", registrationData);

      if (response.data && (response.data.user?.id || response.data.id)) {
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
      } else {
        setErrorMessage("Помилка при створенні облікового запису");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Помилка реєстрації");
      console.error("Помилка реєстрації:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBack(e);
  };

  const handleBackToStep1 = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStep(1);
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback(e);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={styles.form}
        noValidate
      >
        <div className={styles.titleWrapper}>
          <button
            type="button"
            onClick={handleBackClick}
            onKeyDown={(e) => handleKeyDown(e, handleBackClick)}
            className={styles.backButton}
            tabIndex="0"
            aria-label="Повернутися назад"
          >
            ←
          </button>
          <h2 className={styles.title}>Реєстрація</h2>
        </div>

        {errorMessage && (
          <div className={styles.alert} role="alert">
            {errorMessage}
          </div>
        )}

        {step === 1 && (
          <>
            <div className={styles.inputWrapper}>
              <label htmlFor="name" className={styles.label}>
                Ім'я
              </label>
              <input
                id="name"
                {...register("name")}
                placeholder="Ім'я (буде загaльно доступним)"
                className={styles.input}
                aria-label="Ім'я користувача"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className={styles.error} role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Email"
                className={styles.input}
                aria-label="Email адреса"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className={styles.error} role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Пароль"
                className={styles.input}
                aria-label="Пароль"
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className={styles.error} role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Підтвердження паролю
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Підтвердіть пароль"
                className={styles.input}
                aria-label="Підтвердження паролю"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              {errors.confirmPassword && (
                <p className={styles.error} role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.inputWrapper}>
              <label htmlFor="avatar" className={styles.label}>
                Аватар (необов'язково)
              </label>
              <div className={styles.previewContainer}>
                {avatarPreview ? (
                  <div className={styles.avatarPreview}>
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className={styles.avatarImage}
                    />
                  </div>
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <span className={styles.placeholderText}>No image</span>
                  </div>
                )}

                <label
                  htmlFor="avatar"
                  className={styles.chooseFileButton}
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      document.getElementById("avatar").click();
                    }
                  }}
                >
                  Обрати файл
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleAvatarChange}
                    aria-label="Завантажити аватар"
                  />
                </label>
              </div>

              {errors.avatar && (
                <p className={styles.errorMessage} role="alert">
                  {errors.avatar.message}
                </p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="bio" className={styles.label}>
                Про себе (необов'язково)
              </label>
              <textarea
                id="bio"
                {...register("bio")}
                placeholder="Коротко про себе"
                className={styles.textarea}
                aria-label="Біографія користувача"
                aria-invalid={errors.bio ? "true" : "false"}
              />
              {errors.bio && (
                <p className={styles.error} role="alert">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleBackToStep1}
              onKeyDown={(e) => handleKeyDown(e, handleBackToStep1)}
              className={styles.link}
              tabIndex="0"
              aria-label="Повернутися до першого кроку"
            >
              ← Назад
            </button>
          </>
        )}

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting
            ? "Обробка..."
            : step === 1
            ? "Далі"
            : "Завершити реєстрацію"}
        </button>

        {loginError && <p className={styles.error}>{loginError}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
