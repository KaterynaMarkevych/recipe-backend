"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "../shared/Wrapper/Wrapper";
import RecipeCard from "./RecipeCard";
import FilterSection from "./FilterSection";
import styles from "./FilterSection.module.scss";

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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        // Construct query params from filters
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });

        const response = await fetch(`/api/recipes?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Помилка при отриманні рецептів");
        }

        const data = await response.json();
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Не вдалося завантажити рецепти. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have filters or don't have initial data
    if (
      Object.keys(filters).length > 0 ||
      (!initialData.recipes && !initialData.error)
    ) {
      fetchRecipes();
    }
  }, [filters, initialData.recipes, initialData.error]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      </section>
    </Wrapper>
  );
};

export default Recipes;
