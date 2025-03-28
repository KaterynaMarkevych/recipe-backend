"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/recipes"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
        tabIndex="0"
        aria-label="Повернутися до всіх рецептів"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Повернутися до всіх рецептів
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {recipe.image ? (
              <div className="relative w-full h-[300px] md:h-[500px]">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="bg-gray-200 w-full h-[300px] md:h-[500px] flex items-center justify-center">
                <span className="text-gray-400 text-lg">Немає зображення</span>
              </div>
            )}
          </div>

          <div>
            {authorLoading && <p>Завантаження користувача...</p>}
            {authorError && <p>{authorError}</p>}
            {author && (
              <div>
                <img src={author.avatar} alt={author.username} />
                <p>{author.username}</p>
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.type && (
                <span className="bg-black/70 text-white px-2 py-1 text-xs rounded-full">
                  {recipe.type}
                </span>
              )}

              {recipe.difficulty && (
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    difficultyColors[recipe.difficulty]
                  }`}
                >
                  {recipe.difficulty}
                </span>
              )}

              {recipe.diet &&
                recipe.diet.map((dietType, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {dietType}
                  </span>
                ))}
            </div>

            <p className="text-gray-600 mb-6">{recipe.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Час приготування</div>
                  <div className="font-medium">{recipe.cookingTime} хв</div>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Порції</div>
                  <div className="font-medium">{recipe.servings} порц.</div>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Кухня</div>
                  <div className="font-medium">
                    {recipe.cuisine || "Не вказано"}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Рейтинг</div>
                  <div className="font-medium">
                    {recipe.rating?.toFixed(1) || "0.0"}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-2">
                Харчова цінність (на порцію)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-50 p-2 rounded-md text-center">
                  <div className="text-sm text-gray-500">Калорії</div>
                  <div className="font-medium">
                    {recipe.nutrition?.calories || "0"} ккал
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-md text-center">
                  <div className="text-sm text-gray-500">Білки</div>
                  <div className="font-medium">
                    {recipe.nutrition?.protein || "0"} г
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-md text-center">
                  <div className="text-sm text-gray-500">Жири</div>
                  <div className="font-medium">
                    {recipe.nutrition?.fats || "0"} г
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-md text-center">
                  <div className="text-sm text-gray-500">Вуглеводи</div>
                  <div className="font-medium">
                    {recipe.nutrition?.carbs || "0"} г
                  </div>
                </div>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
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
