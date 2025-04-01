"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import RecipeCard from "@/components/Recipes/RecipeCard";
import styles from "./PopularRecipeSection.module.scss";

const PopularRecipeSection = ({ initialData = {} }) => {
  const [recipes, setRecipes] = useState(initialData.recipes || []);
  const [loading, setLoading] = useState(
    !initialData.recipes && !initialData.error
  );
  const [error, setError] = useState(initialData.error || null);

  useEffect(() => {
    // Only fetch if we don't have initial data
    if (!initialData.recipes && !initialData.error) {
      const fetchPopularRecipes = async () => {
        try {
          setLoading(true);
          // Fetching popular recipes (highest rated)
          const response = await fetch("/api/recipes?sort=rating&limit=4");

          if (!response.ok) {
            throw new Error("Помилка при отриманні рецептів");
          }

          const data = await response.json();
          setRecipes(data.slice(0, 4)); // Ensure we only display up to 4 recipes
          setError(null);
        } catch (err) {
          console.error("Error fetching popular recipes:", err);
          setError("Не вдалося завантажити популярні рецепти.");
        } finally {
          setLoading(false);
        }
      };

      fetchPopularRecipes();
    }
  }, [initialData.recipes, initialData.error]);

  return (
    <section className={styles.popularSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className="text-2xl font-bold mb-2">Популярні рецепти</h2>
          <p className="text-gray-600 max-w-2xl ">
            Найпопулярніші рецепти нашої платформи, які отримали найбільше
            позитивних відгуків від користувачів.
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Популярні рецепти не знайдено.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}

        <div className={styles.viewAll}>
          <Link href="/recipes" className={styles.viewAllButton}>
            Переглянути всі рецепти
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularRecipeSection;
