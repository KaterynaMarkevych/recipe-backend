import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Recipe from "@/models/Recipe";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import PublishedRecipes from "@/components/Recipes/PublishedRecipes";

export default async function PublishedRecipesPage() {
  const session = await getServerSession(authOptions);
  await connectToDatabase();

  if (!session?.user?.email) {
    return <p>Необхідно увійти для перегляду опублікованих рецептів.</p>;
  }

  // Знаходимо користувача за email
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return <p>Користувача не знайдено.</p>;
  }

  // Шукаємо опубліковані рецепти цього користувача
  const publishedRecipes = await Recipe.find({
    author: user._id,
    is_published: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  // Преобразувати _id в рядок у кожному рецепті і в інгредієнтах
  const recipesForClient = publishedRecipes.map((recipe) => {
    return {
      ...recipe,
      _id: recipe._id.toString(),
      author: recipe.author.toString(),
      ingredients: (recipe.ingredients ?? []).map((ing) => ({
        ...ing,
        _id: ing._id ? ing._id.toString() : undefined,
      })),
      comments: (recipe.comments ?? []).map((comment) => ({
        ...comment,
        _id: comment._id ? comment._id.toString() : undefined,
        user: comment.user ? comment.user.toString() : undefined,
      })),
      ratings: (recipe.ratings ?? []).map((r) => ({
        ...r,
        _id: r._id ? r._id.toString() : undefined,
        user: r.user ? r.user.toString() : undefined,
      })),
    };
  });

  return (
    <main>
      <Wrapper>
        <PublishedRecipes recipes={recipesForClient} />
      </Wrapper>
    </main>
  );
}
