import RecipeCard from "./RecipeCard";

export default function SavedRecipesList({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return <p>У вас поки немає збережених рецептів.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Збережені рецепти</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
