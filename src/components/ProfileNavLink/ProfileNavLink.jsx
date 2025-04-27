"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AuthModal from "@/components/Auth/AuthModal/AuthModal";
import styles from "../Header/Header.module.scss";

export default function ProfileNavLink() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClick = (e) => {
    // блокуємо перехід і відкриваємо модалку
    if (!session) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  if (status === "loading") return null;

  return (
    <>
      <li>
        {session ? (
          // Якщо є session — звичайне посилання на профіль
          <Link href={`/profile/${session.user.id}`} className={styles.link}>
            Профіль
          </Link>
        ) : (
          // Якщо нема session — кнопка-заглушка
          <li>
            <a href="#" className={styles.link} onClick={handleClick}>
              Профіль
            </a>
          </li>
        )}
      </li>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
