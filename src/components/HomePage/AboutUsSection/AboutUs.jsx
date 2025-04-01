"use client";

import React, { useState, useEffect } from "react";
import Line from "@/components/shared/Line/Line";
import styles from "./AboutUs.module.scss";

const AboutUs = () => {
  const [visibleParagraphs, setVisibleParagraphs] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paragraphs = [
    "EasyIngrecipes – ваш надійний помічник у приготуванні смачних страв! Не знаєте, що приготувати на вечерю, обід чи святковий стіл?",
    "EasyIngrecipes допоможе кожній господині знайти ідеальний рецепт для будь-якої події. У нас є рішення для кожного: вегетаріанці, вегани, любителі м'яса – всі знайдуть смачні та корисні варіанти.",
    "Якщо ви не хочете витрачати багато часу на приготування або не впевнені у своїх кулінарних навичках, у нас є опція вибору складності та часу приготування страв. Просто введіть інгредієнти, які є у вашому холодильнику, і наш сайт запропонує рецепти, що підійдуть саме вам.",
    "Наша місія – зробити кулінарію доступною, легкою та захоплюючою для кожного, незалежно від вашого рівня майстерності або наявних інгредієнтів.",
  ];

  const handleShowMore = () => {
    setVisibleParagraphs((prev) => Math.min(prev + 1, paragraphs.length));
  };

  const handleCollapse = () => {
    setVisibleParagraphs(1);
  };

  return (
    <div className={styles.aboutUsContainer} id="about-us">
      <Line />
      <h2 className={styles.title}>Про нас</h2>
      {paragraphs.map((text, index) => (
        <p
          key={index}
          className={styles.text}
          style={{
            display: index < visibleParagraphs || !isMobile ? "block" : "none",
          }}
        >
          {text}
        </p>
      ))}
      <div className={styles.buttonsContainer}>
        {visibleParagraphs < paragraphs.length && (
          <button className={styles.toggleButton} onClick={handleShowMore}>
            Показати більше
          </button>
        )}
        {visibleParagraphs > 1 && (
          <button className={styles.toggleButton} onClick={handleCollapse}>
            Згорнути
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
