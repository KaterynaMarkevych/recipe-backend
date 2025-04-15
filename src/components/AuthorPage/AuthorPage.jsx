"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "../shared/Buttons/Button";
import RecipeCard from "../Recipes/RecipeCard";
import styles from "./AuthorPage.module.scss";

const AuthorPage = ({ id, initialData = {} }) => {
  const [user, setUser] = useState(initialData.user || null);
  const [loading, setLoading] = useState(
    !initialData.user && !initialData.error
  );
  const [error, setError] = useState(initialData.error || null);

  useEffect(() => {
    if (!initialData.user && !initialData.user && id) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await fetch(`api/users/${id}`);

          if (!response.ok) {
            throw new Error("Не вдалося завантажити користувача");
          }

          const data = await response.json();
          setUser(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Не вдалося завантажити користувача. Спробуйте пізніше.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, initialData.user, initialData.error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/recipes"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            tabIndex="0"
            aria-label="Повернутися до всіх рецептів"
          >
            ← Повернутися до всіх рецептів
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">Користувача не знайдено</span>
        </div>
        <div className="mt-4">
          <Link
            href="/recipes"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            tabIndex="0"
            aria-label="Повернутися до всіх рецептів"
          >
            ← Повернутися до всіх рецептів
          </Link>
        </div>
      </div>
    );
  }

  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const fetchRecipes = async (userId) => {
    try {
      setLoadingRecipes(true);
      const response = await fetch(`/api/recipes`);
      if (!response.ok) throw new Error("Не вдалося завантажити рецепти");

      const data = await response.json();

      //рецепти, які належать користувачу
      const userRecipes = data.filter((recipe) => recipe.author === userId);

      setRecipes(userRecipes);
      setError(null);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Помилка завантаження рецептів");
    } finally {
      setLoadingRecipes(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecipes(user._id);
    }
  }, [user]);
  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.bio}>
          <img
            src={user.avatar}
            alt={user.username}
            className={styles.userAvatar}
          />
          <div className={styles.bioInfo}>
            <h2 className={styles.userName}>{user.username}</h2>
            <span className={styles.userBio}>{user.bio}</span>
          </div>
        </div>

        <div className={styles.userStats}>
          <div className={styles.topRow}>
            <p className={styles.stats}>
              {" "}
              <span className={styles.count}>{user.followers}</span> підписників
            </p>
            <p className={styles.stats}>
              {" "}
              <span className={styles.count}>{user.following}</span> підписок
            </p>
          </div>
          <p className={styles.stats}>
            <span className={styles.count}>{recipes.length}</span> опублікованих
            рецептів
          </p>
          <div className={styles.buttonContainer}>
            <Button>Підписатися</Button>
          </div>
        </div>
      </div>

      <h2 className={styles.title}>
        Рецепти <span className={styles.count}>({recipes.length})</span>:
      </h2>
      <div>
        {loadingRecipes ? (
          <p>Завантаження рецептів...</p>
        ) : recipes.length > 0 ? (
          <div className={styles.gridContainer}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p>Користувач ще не додав жодного рецепта.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
