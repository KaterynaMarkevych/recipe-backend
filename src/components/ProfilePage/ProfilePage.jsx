"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Button from "../shared/Buttons/Button";
import Line from "../shared/Line/Line";
import { AddRecipeButton } from "../shared/Buttons/AddRecipeButton";
import styles from "./ProfilePage.module.scss";
import image from "@/../public/user-page-images/recipe-sketch.jpg";
import globeIcon from "@/../public/user-page-images/globe.svg";
import bookmarkIcon from "@/../public/user-page-images/bookmark.svg";
import lockkIcon from "@/../public/user-page-images/lock.svg";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user-route");
        setUser(res.data);
      } catch (err) {
        console.error("Помилка отримання даних користувача:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Завантаження профілю...</div>;

  const isProfileIncomplete = !user.bio || !user.avatar;
  console.log(user);
  return (
    <div className={styles.profilePage}>
      <div className={styles.hero}>
        <div className={styles.infoWraper}>
          <img
            src={user.avatar || "/default-avatar.jpg"}
            alt="User avatar"
            className={styles.avatar}
          />
          <div className={styles.info}>
            <h2 className={styles.username}>
              {user.username || "Ім'я користувача"}
            </h2>
            <p className={styles.bio}>{user.bio || "Про себе ще не додано."}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.topRow}>
            <p className={styles.statsIteam}>
              <span className={styles.count}>{user.following || 0}</span>{" "}
              підписки
            </p>
            <p className={styles.statsIteam}>
              <span className={styles.count}>{user.followers || 0}</span>{" "}
              підписників
            </p>
          </div>
          <div className={styles.bottomCenter}>
            <p className={styles.statsIteam}>
              <span className={styles.count}>
                {user?.stats?.published || 0}
              </span>{" "}
              опублікованих рецептів
            </p>
            {/*поля published не має в моделі користувача */}
          </div>
          <Button>
            {isProfileIncomplete ? "Заповнити профіль" : "Редагувати профіль"}
          </Button>
        </div>
      </div>

      <Line />

      <div className={styles.container}>
        <div className={styles.cta}>
          <Link href="/saved" className={styles.buttonLink}>
            <Button variant="secondary" size="bigSize">
              <Image
                src={bookmarkIcon}
                alt="bookmarkIcon"
                className={styles.icon}
              />
              Збережені рецепти
            </Button>
          </Link>
          <Link href="/published" className={styles.buttonLink}>
            <Button variant="secondary" size="bigSize">
              <Image src={globeIcon} alt="globeIcon" className={styles.icon} />
              Опубліковані рецепти
            </Button>
          </Link>
          <Link href="/private" className={styles.buttonLink}>
            <Button variant="secondary" size="bigSize">
              <Image src={lockkIcon} alt="lockkIcon" className={styles.icon} />
              Приватні рецепти
            </Button>
          </Link>
        </div>

        <div className={styles.addRecipe}>
          <Image src={image} alt="sketch recipe" className={styles.image} />
          <AddRecipeButton />
        </div>
      </div>
    </div>
  );
}
