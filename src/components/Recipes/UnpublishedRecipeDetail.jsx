// components/Recipes/UnpublishedRecipeDetail.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./RecipeDetail.module.scss";
import { ICONS } from "@/constants/icons";
import Button from "../shared/Buttons/Button";

const difficultyColors = {
  Легко: "bg-green-100 text-green-800",
  Середньо: "bg-yellow-100 text-yellow-800",
  Складно: "bg-red-100 text-red-800",
};

const UnpublishedRecipeDetail = ({ recipe }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [successMessage, setSuccessMessage] = useState("");

  const handlePublish = async () => {
    setLoading(true);
    setSuccessMessage("");

    const res = await fetch(`/api/recipes/${recipe._id}`, {
      method: "PATCH",
    });
    if (res.ok) {
      router.refresh(); // reload page to reflect published state
    }
    setLoading(false);
    setSuccessMessage("Рецепт успішно опубліковано!");
    setTimeout(() => {
      if (session?.user?.id) {
        window.location.href = `/profile/${session.user.id}`;
      } else {
        window.location.href = `/`;
      }
    }, 1500);
  };

  const handleDelete = async () => {
    const confirmed = confirm("Ви дійсно хочете видалити рецепт?");
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/recipes/${recipe._id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/private-recipes");
    } else {
      alert("Помилка при видаленні рецепта.");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 pb-12">
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
          </div>

          <div className={styles.infoWrapper}>
            <div className={styles.titleWrapper}>
              <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
            </div>
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
                  src={ICONS.clock}
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
                  src={ICONS.users}
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
                  src={ICONS.globe}
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
                  src={ICONS.stars}
                  alt="Star icon"
                  className="h-5 w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
                />
                <div>
                  <p className={styles.titles}>Рейтинг</p>
                  <p className="font-medium text-base md:text-lg lg:text-xl">
                    0
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
                  <span>
                    <span className="font-semibold text-black-700">
                      {ingredient.quantity}
                    </span>{" "}
                    <span className="font-semibold text-black-700">
                      {ingredient.unit}
                    </span>{" "}
                    {ingredient.name}
                  </span>
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

      <div className="flex  justify-center gap-3 mb-8">
        <Button
          onClick={() =>
            (window.location.href = `/private-recipes/${recipeId}/edit`)
          }
        >
          Редагувати
        </Button>

        <Button onClick={handlePublish} disabled={loading}>
          Опублікувати
        </Button>

        <Button onClick={handleDelete} disabled={loading}>
          Видалити
        </Button>
      </div>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
    </div>
  );
};

export default UnpublishedRecipeDetail;
