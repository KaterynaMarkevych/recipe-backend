import { connectToDatabase } from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import UnpublishedRecipeCard from "@/components/Recipes/UnpublishedRecipeCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

async function getUserUnpublishedRecipes(userId) {
  try {
    await connectToDatabase();

    const recipes = await Recipe.find({
      is_published: false,
      author: userId,
    });

    return {
      recipes: JSON.parse(JSON.stringify(recipes)),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user unpublished recipes:", error);
    return {
      recipes: [],
      error: "Помилка при отриманні рецептів",
    };
  }
}

export default async function PrivateRecipesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Wrapper>
        <h1 className="text-2xl font-bold mb-6">Приватні рецепти</h1>
        <p>Увійдіть, щоб переглянути свої рецепти.</p>
      </Wrapper>
    );
  }

  const userId = session.user.id;
  const { recipes, error } = await getUserUnpublishedRecipes(userId);

  return (
    <main>
      <Wrapper>
        <h1 className="text-2xl font-bold mb-6">Ваші неопубліковані рецепти</h1>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : recipes.length === 0 ? (
          <p>У вас поки немає неопублікованих рецептів.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <UnpublishedRecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </Wrapper>
    </main>
  );
}
