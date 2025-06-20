"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ICONS } from "@/constants/icons";

export default function RecipeRating({
  recipeId,
  initialRating,
  onRatingChange,
}) {
  const { data: session } = useSession();
  const [average, setAverage] = useState(initialRating || 0);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(0);

  const handleRate = async (value) => {
    if (!session) return;

    try {
      const res = await axios.post(`/api/recipes/${recipeId}/rate`, { value });
      setSelected(value);
      setAverage(res.data.rating);
      if (onRatingChange) onRatingChange(res.data.rating);
    } catch (err) {
      console.error("Error sending rating", err);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="none"
              fill={(hover || selected) >= star ? "#FACC15" : "#D1D5DB"}
              className={`aspect-square h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 cursor-pointer transition ${
                !session ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            >
              <path
                fillRule="evenodd"
                d="M11.48 3.499a.75.75 0 011.04 0l2.598 2.634 3.638.56a.75.75 0 01.418 1.28l-2.63 2.512.636 3.777a.75.75 0 01-1.09.79L12 13.347l-3.09 1.705a.75.75 0 01-1.09-.79l.637-3.776-2.63-2.512a.75.75 0 01.418-1.28l3.638-.56 2.598-2.634z"
                clipRule="evenodd"
              />
            </svg>
          ))}
          <div>
            <span className="text-sm md:text-base text-gray-600">
              {session
                ? "Оцініть рецепт, якщо ви його спробували"
                : "Увійдіть, щоб оцінити рецепт"}{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
