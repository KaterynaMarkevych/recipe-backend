import { useEffect, useState } from "react";
import RecipeCard from "../Recipes/RecipeCard";

const SavedRecipesSection = ({ authorId }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!authorId) {
        console.warn("authorId is missing");
        return;
      }

      try {
        const res = await fetch(`/api/users/savedRecipes?authorId=${authorId}`);
        const data = await res.json();
        setRecipes(data.savedRecipes || []);
      } catch (error) {
        console.error("Помилка під час отримання збережених рецептів:", error);
      }
    };

    fetchSavedRecipes();
  }, [authorId]);

  if (!recipes.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-[#2b3a39] text-[20px] font-bold text-left my-5">
        Збережені рецепти автора
        <span className="font-bold"> ({recipes.length})</span>:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default SavedRecipesSection;
