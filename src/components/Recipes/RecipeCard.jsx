"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.scss";
import { ICONS } from "@/constants/icons";

// Define colors for recipe difficulty badges
const difficultyColors = {
  Легко: "bg-green-100 text-green-800",
  Середньо: "bg-yellow-100 text-yellow-800",
  Складно: "bg-red-100 text-red-800",
};

const RecipeCard = ({ recipe }) => {
  return (
    <div className={styles.card}>
      <div className="relative h-48 w-full">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Немає зображення</span>
          </div>
        )}
        {recipe.type && (
          <span className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded-full">
            {recipe.type}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{recipe.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center">
            <img src={ICONS.clock} className="h-4 w-4 mr-1" />
            <span>{recipe.cookingTime} хв</span>
          </div>

          <div className="flex items-center">
            <img src={ICONS.users} alt="Users Icon" className="h-4 w-4 mr-1" />
            <span>{recipe.servings} порц.</span>
          </div>

          {recipe.difficulty && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                difficultyColors[recipe.difficulty]
              }`}
            >
              {recipe.difficulty}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {recipe.diet &&
            recipe.diet.map((dietType, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
              >
                {dietType}
              </span>
            ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={ICONS.stars} alt="Star icon" className="h-5 w-5" />
            <span className="ml-1 text-sm">
              {recipe.rating?.toFixed(1) || "0.0"}
            </span>
          </div>

          <Link
            href={`/recipes/${recipe._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            tabIndex="0"
            aria-label={`Переглянути рецепт: ${recipe.title}`}
          >
            Докладніше →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
