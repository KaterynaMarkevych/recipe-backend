"use client";

import Image from "next/image";
import styles from "./HeroSection.module.scss";
import photo1 from "../../../../public/hero-section-images/picture1.svg";
import mobilephoto from "../../../../public/hero-section-images/heromobile.svg";
import photo2 from "../../../../public/hero-section-images/picture2.svg";
import photo3 from "../../../../public/hero-section-images/picture3.svg";
import photo4 from "../../../../public/hero-section-images/picture4.svg";

const HeroSection = () => {
  return (
    <div className={styles.heroSectionContainer}>
      <h1 className={styles.heroHeader}>
        Знаходь рецепти своїх улюблених страв
      </h1>
      <div className={styles.backgroundHero}>
        <p className={styles.heroText}>
          Не знаєш що приготувати? Шукай рецепти з продуктів, які вже є у твоєму
          холодильнику!
        </p>
        <div className={styles.photoContainer}>
          <Image src={photo1} alt="Photo1" className={styles.photo1} />
          <Image
            src={mobilephoto}
            alt="MobilePhoto"
            className={styles.mobilePhoto}
          />
          <Image src={photo2} alt="Photo2" className={styles.photo2} />
          <Image src={photo3} alt="Photo3" className={styles.photo3} />
          <Image src={photo4} alt="Photo4" className={styles.photo4} />
        </div>
        <p className={styles.heroText2}>Використовуй пошук за інгредієнтами</p>
      </div>
      <hr className={styles.line} />
    </div>
  );
};

export default HeroSection;
