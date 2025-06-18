"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "../shared/Wrapper/Wrapper";
import RecipeCard from "./RecipeCard";
import FilterSection from "./FilterSection";
import styles from "./style.module.scss";

const difficultyColors = {
  Легко: "bg-green-100 text-green-800",
  Середньо: "bg-yellow-100 text-yellow-800",
  Складно: "bg-red-100 text-red-800",
};

const Recipes = ({ initialData = {} }) => {
  const [recipes, setRecipes] = useState(initialData.recipes || []);
  const [loading, setLoading] = useState(
    !initialData.recipes && !initialData.error
  );
  const [error, setError] = useState(initialData.error || null);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1); // Поточна сторінка
  const [hasMore, setHasMore] = useState(true); // Чи є ще рецепти

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        queryParams.append("page", 1);
        queryParams.append("limit", 6);

        const response = await fetch(
          `/api/filter-recipes?${queryParams.toString()}`
        );

        if (!response.ok) throw new Error("Помилка при отриманні рецептів");

        const data = await response.json();

        setRecipes(data);
        setPage(1); // Скидаємо сторінку
        setHasMore(data.length === 6); // Якщо прийшло менше 6 — довантажувати вже нема чого
        setError(null);
      } catch (err) {
        setError("Не вдалося завантажити рецепти.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filters]);
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const loadMoreRecipes = async () => {
    try {
      setLoading(true);
      const nextPage = page + 1;

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      queryParams.append("page", nextPage);
      queryParams.append("limit", 6);

      const response = await fetch(
        `/api/filter-recipes?${queryParams.toString()}`
      );

      if (!response.ok) throw new Error("Помилка при отриманні рецептів");

      const newRecipes = await response.json();

      if (newRecipes.length === 0) {
        setHasMore(false); // Більше рецептів нема
      } else {
        setRecipes((prev) => [...prev, ...newRecipes]); // Додаємо до існуючих
        setPage(nextPage); // Зберігаємо нову сторінку
      }

      setError(null);
    } catch (err) {
      console.error("Error loading more recipes:", err);
      setError("Не вдалося завантажити більше рецептів.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <section>
        <h1 className="text-3xl font-bold text-left mb-12 ml-5">Рецепти</h1>
        <div className={styles.container}>
          <FilterSection onFilterChange={handleFilterChange} />

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6 text-center"
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
              <p className="text-gray-600 text-lg">
                Рецептів за вашим запитом не знайдено
              </p>
            </div>
          ) : (
            <div className={styles.gridContainer}>
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
        {!loading && hasMore && (
          <div className="flex justify-flext-start mb-8 ml-4">
            <button
              onClick={loadMoreRecipes}
              className="px-6 py-2 text-black  rounded-lg shadow"
              style={{
                backgroundColor: "#b9d7ea",
              }}
            >
              Показати більше
            </button>
          </div>
        )}
      </section>
    </Wrapper>
  );
};

export default Recipes;
