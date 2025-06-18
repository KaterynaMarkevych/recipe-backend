import RecipeCard from "./RecipeCard";

export default function PublishedRecipes({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="p-4 sm:p-16 lg:p-16 mb-16 sm:mb-16 lg:mb-16 mx-4 sm:mx-8 lg:mx-16">
        <h1 className="text-2xl font-bold mb-6">Ваші рецепти</h1>
        <p className="mb-16 p-2">У вас ще немає опублікованих рецептів.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-4 lg:p-8 mb-16 sm:mb-16 lg:mb-16 mx-4 sm:mx-4 lg:mx-16">
      <h1 className="text-2xl font-bold mb-4">Ваші рецепти</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
