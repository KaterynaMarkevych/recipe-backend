"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import AuthButton from "../shared/Buttons/AuthButton";
import { AddRecipeButton } from "../shared/Buttons/AddRecipeButton";
import ProfileNavLink from "../ProfileNavLink/ProfileNavLink";
import styles from "./Header.module.scss";
import Image from "next/image";
import logo from "../../../public/logo.svg";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(
        `/search-recipe?searchTerm=${encodeURIComponent(searchTerm.trim())}`
      );
      setIsMenuOpen(false); // якщо мобільне меню було відкрите
    }
  };
  return (
    <header
      className={classNames(styles.header, {
        [styles.small]: scrolled,
      })}
    >
      <div className={styles.container}>
        <div className={styles.headerInfoContainer}>
          <div className={styles.searchContainer}>
            <Image
              src={logo}
              alt="EasyIngrecipes"
              className={styles.logo}
              onClick={() => router.push("/")}
            />
            <input
              type="text"
              placeholder='"борошно, яйця" або "шарлотка"'
              className={styles.searchField}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <div className={styles.CTA}>
              <AuthButton />
              <AddRecipeButton />
            </div>
          </div>

          <div className={styles.navigationContainer}>
            <nav
              className={classNames(styles.navMenu, {
                [styles.open]: isMenuOpen,
                [styles.hidden]: scrolled,
              })}
            >
              <ul className={styles.navList}>
                <li>
                  <a href="/recipes" className={styles.link}>
                    Рецепти
                  </a>
                </li>
                <li>
                  <a href="/cook-type" className={styles.link}>
                    Тип кухні
                  </a>
                </li>

                <ProfileNavLink />

                <li>
                  <a href="/#about-us" className={styles.link}>
                    Про нас
                  </a>
                </li>
              </ul>
            </nav>

            <button className={styles.burgerMenu} onClick={toggleMenu}>
              <FontAwesomeIcon
                icon={isMenuOpen ? faTimes : faBars}
                size="lg"
                color="#525252"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
