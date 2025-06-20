import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import UnpublishedRecipeDetail from "@/components/Recipes/UnpublishedRecipeDetail";

export default async function UnpublishedRecipePage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <Wrapper>
        <p className="text-red-500">Некоректний ID рецепта.</p>
      </Wrapper>
    );
  }

  await connectToDatabase();

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return (
      <Wrapper>
        <p className="text-red-500">Рецепт не знайдено.</p>
      </Wrapper>
    );
  }

  if (recipe.author.toString() !== session.user.id) {
    return (
      <Wrapper>
        <p className="text-red-500">У вас немає доступу до цього рецепта.</p>
      </Wrapper>
    );
  }

  return (
    <main>
      <Wrapper>
        <UnpublishedRecipeDetail recipe={JSON.parse(JSON.stringify(recipe))} />
      </Wrapper>
    </main>
  );
}
