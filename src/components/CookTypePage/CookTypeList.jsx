"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/Recipes/RecipeCard";

const cuisineTypes = [
  "Французька",
  "Італійська",
  "Грецька",
  "Середземноморська",
  "Українська",
  "Китайська",
  "Японська",
  "Індійська",
  "Корейська",
  "Тайська",
  "Мексиканська",
  "Американська",
  "Бразильська",
  "Турецька",
  "Арабська",
  "Ізраїльська",
  "Африканська",
  "Ефіопська",
];

const CookTypeList = () => {
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadRecipes = async (reset = false) => {
    if (!selectedCuisine) return;

    setLoading(true);

    const queryParams = new URLSearchParams({
      cuisine: selectedCuisine,
      page: reset ? "1" : page.toString(),
      limit: "6",
    });

    const res = await fetch(`/api/filter-recipes?${queryParams}`);
    const data = await res.json();

    if (reset) {
      setRecipes(data);
      setPage(2); // після першої порції
    } else {
      setRecipes((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    }

    setHasMore(data.length === 6);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCuisine) {
      loadRecipes(true);
    }
  }, [selectedCuisine]);

  return (
    <div className="p-4 sm:p-16 lg:p-16 mb-16 sm:mb-16 lg:mb-16 mx-4 sm:mx-8 lg:mx-16">
      <h1 className="text-3xl font-bold text-left mb-8">Тип кухні</h1>
      <div className="flex flex-wrap gap-3 mb-8">
        {cuisineTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedCuisine(type);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full border text-sm ${
              selectedCuisine === type
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Блок з рецептами */}
      {recipes.length > 0 ? (
        <div className="mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => loadRecipes(false)}
                className="px-6 py-2 rounded-lg shadow text-white hover:bg-blue-600"
                style={{ backgroundColor: "#b9d7ea" }}
              >
                Показати більше
              </button>
            </div>
          )}
        </div>
      ) : selectedCuisine && !loading ? (
        <p className="text-center mt-12 text-gray-500">
          Рецептів для типу «{selectedCuisine}» не знайдено.
        </p>
      ) : null}

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
};

export default CookTypeList;
