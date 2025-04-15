"use client";
import { useState } from "react";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import styles from "./AuthModal.module.scss";

export default function AuthModal({ onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => setIsRegistering((prev) => !prev);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
        {isRegistering ? (
          <RegisterForm onBack={toggleForm} />
        ) : (
          <LoginForm onRegisterClick={toggleForm} />
        )}
      </div>
    </div>
  );
}
