import Link from "next/link";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLinks}>
          <nav className={styles.navigation}>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <Link href="/national_cuisine">Національна кухня</Link>
              </li>
              <li className={styles.listItem}>
                <Link href="/cook_type">Тип кухні</Link>
              </li>
              <li className={styles.listItem}>
                <Link href="/profile">Профіль</Link>
              </li>
              <li className={styles.listItem}>
                <Link href="/#about-us">Про нас</Link>
              </li>
            </ul>
          </nav>

          <div className={styles.info}>
            <ul className={styles.infoList}>
              <li className={styles.infoListItem}>
                <Link href="/privacy">Політика конфіденційності</Link>
              </li>
              <li className={styles.infoListItem}>
                <Link href="/terms">Умови використання</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyRight}>@ EasyIngrecipes 2024</p>
          <p className={styles.developer}>Дизайн і розробка klift</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
