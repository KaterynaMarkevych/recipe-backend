"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowLeftIcon from "../shared/ArrowLeftIcon/ArrowLeftIcon";
import styles from "./RecipeDetail.module.scss";

// Define colors for difficulty badges outside the component
const difficultyColors = {
  Легко: "bg-green-100 text-green-800",
  Середньо: "bg-yellow-100 text-yellow-800",
  Складно: "bg-red-100 text-red-800",
};

const RecipeDetail = ({ id, initialData = {} }) => {
  const [recipe, setRecipe] = useState(initialData.recipe || null);
  const [loading, setLoading] = useState(
    !initialData.recipe && !initialData.error
  );
  const [error, setError] = useState(initialData.error || null);

  useEffect(() => {
    // Only fetch data if we don't have initial data
    if (!initialData.recipe && !initialData.error && id) {
      const fetchRecipe = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/recipes/${id}`);

          if (!response.ok) {
            throw new Error("Не вдалося завантажити рецепт");
          }

          const data = await response.json();
          setRecipe(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching recipe:", err);
          setError("Не вдалося завантажити рецепт. Спробуйте пізніше.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [id, initialData.recipe, initialData.error]);

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

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">Рецепт не знайдено</span>
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
  console.log(recipe);
  console.log(recipe.steps);

  const [author, setAuthor] = useState(null); // Стейт для користувача
  const [authorLoading, setAuthorLoading] = useState(false);
  const [authorError, setAuthorError] = useState(null);
  // Функція для отримання даних користувача
  const fetchUser = async (userId) => {
    try {
      setAuthorLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Не вдалося завантажити користувача");
      }
      const user = await response.json();
      setAuthor(user);
      setAuthorError(null);
    } catch (err) {
      console.error("Error fetching user:", err);
      setAuthorError("Не вдалося завантажити користувача");
    } finally {
      setAuthorLoading(false);
    }
  };

  useEffect(() => {
    if (recipe?.author) {
      fetchUser(recipe.author);
    }
  }, [recipe]);

  return (
    <div className="container mx-auto px-4 pb-12">
      <Link
        href="/recipes"
        className="inline-flex items-center text-blue-400 hover:text-blue-600 transition-colors mb-6"
        tabIndex="0"
        aria-label="Повернутися до всіх рецептів"
      >
        <ArrowLeftIcon />
        Повернутися до всіх рецептів
      </Link>

      <div className={styles.container}>
        <div className="md:flex">
          <div className={styles.imagesContainer}>
            {recipe.image ? (
              <div className="relative w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  width={500}
                  height={300}
                  className={styles.image}
                  priority
                />
              </div>
            ) : (
              <div className="bg-gray-200 w-full h-[300px] md:h-[500px] flex items-center justify-center">
                <span className="text-gray-400 text-lg">Немає зображення</span>
              </div>
            )}

            <div className={styles.userWrapper}>
              {authorLoading && <p>Завантаження користувача...</p>}
              {authorError && <p>{authorError}</p>}
              {author && (
                <div className={styles.userContainer}>
                  <img
                    src={author.avatar}
                    alt={author.username}
                    className={styles.userAvatar}
                  />
                  <p className={styles.userName}>{author.username}</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoWrapper}>
            <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
            <div className={styles.infoContainer}>
              <p className={styles.infoItem}>
                Тип страви:
                {recipe.type && (
                  <span className="bg-black/70 text-white px-2 py-1 text-xs rounded-full ml-1 sm:text-sm md:text-base lg:text-lg">
                    {recipe.type}
                  </span>
                )}
              </p>
              <p className={styles.infoItem}>
                Складність приготування:
                {recipe.difficulty && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ml-1 sm:text-sm md:text-base lg:text-lg ${
                      difficultyColors[recipe.difficulty]
                    }`}
                  >
                    {recipe.difficulty}
                  </span>
                )}
              </p>

              <p className={styles.infoItem}>
                Дієти:
                {recipe.diet &&
                  recipe.diet.map((dietType, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full  ml-1 sm:text-sm md:text-base lg:text-lg"
                    >
                      {dietType}
                    </span>
                  ))}
              </p>
            </div>

            <p className={styles.description}>{recipe.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <img
                  src="/icons/clock.svg"
                  alt="Star icon"
                  className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
                />
                <div>
                  <p className={styles.titles}>Час приготування</p>
                  <p className="font-medium text-base md:text-lg lg:text-xl">
                    {recipe.cookingTime} хв
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <img
                  src="/icons/users.svg"
                  alt="Star icon"
                  className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
                />
                <div>
                  <p className={styles.titles}>Порції</p>
                  <p className="font-medium text-base md:text-lg lg:text-xl">
                    {recipe.servings} порц.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <img
                  src="/icons/globe.svg"
                  alt="Star icon"
                  className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
                />
                <div>
                  <p className={styles.titles}>Кухня</p>
                  <p className="font-medium text-base md:text-lg lg:text-xl">
                    {recipe.cuisine || "Не вказано"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <img
                  src="/icons/star.svg"
                  alt="Star icon"
                  className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
                />
                <div>
                  <p className={styles.titles}>Рейтинг</p>
                  <p className="font-medium text-base md:text-lg lg:text-xl">
                    {recipe.rating?.toFixed(1) || "0.0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-6">
          <h3 className="text-lg font-medium mb-2 md:text-xl lg:text-2xl">
            Харчова цінність (на порцію)
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 p-2 rounded-md text-center">
              <div className="text-sm text-gray-500 md:text-base lg:text-lg">
                Калорії
              </div>
              <div className="font-medium md:text-lg lg:text-xl">
                {recipe.nutrition?.calories || "0"} ккал
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded-md text-center">
              <div className="text-sm text-gray-500 md:text-base lg:text-lg">
                Білки
              </div>
              <div className="font-medium md:text-lg lg:text-xl">
                {recipe.nutrition?.protein || "0"} г
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded-md text-center">
              <div className="text-sm text-gray-500 md:text-base lg:text-lg">
                Жири
              </div>
              <div className="font-medium md:text-lg lg:text-xl">
                {recipe.nutrition?.fats || "0"} г
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded-md text-center">
              <div className="text-sm text-gray-500 md:text-base lg:text-lg">
                Вуглеводи
              </div>
              <div className="font-medium md:text-lg lg:text-xl">
                {recipe.nutrition?.carbs || "0"} г
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Інгредієнти</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recipe.ingredients &&
              recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span>{ingredient}</span>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Спосіб приготування</h2>
          <ol className="space-y-4">
            {recipe.steps &&
              recipe.steps.map((step, index) => (
                <li key={index} className="flex">
                  <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
