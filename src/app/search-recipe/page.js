"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/Recipes/RecipeCard";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import axios from "axios";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm) return;
      try {
        const res = await axios.get("/api/filter-recipes", {
          params: { searchTerm, limit: 20, page: 1 },
        });
        setRecipes(res.data);
      } catch (err) {
        console.error("Помилка при пошуку:", err);
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <main>
      <Wrapper>
        <div className="p-4 sm:p-16 lg:p-16 mb-16 sm:mb-16 lg:mb-16 mx-4 sm:mx-8 lg:mx-16">
          <h1 className="text-2xl font-bold mb-6">
            Результати пошуку: {searchTerm}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            ) : (
              <p className="mb-16 p-2">Рецептів не знайдено.</p>
            )}
          </div>
        </div>
      </Wrapper>
    </main>
  );
};

export default SearchPage;
