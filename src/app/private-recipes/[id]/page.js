import { getRecipeById } from "@/lib/recipes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import UnpublishedRecipeDetail from "@/components/Recipes/UnpublishedRecipeDetail";
import { redirect } from "next/navigation";

export default async function UnpublishedRecipePage({ params }) {
  const session = await getServerSession(authOptions);

  params = await params;
  if (!session) {
    redirect("/login");
  }

  try {
    const recipe = await getRecipeById(params.id, session.user.id);
    const plainRecipe = JSON.parse(JSON.stringify(recipe));

    return (
      <main>
        <Wrapper>
          <UnpublishedRecipeDetail recipe={plainRecipe} />
        </Wrapper>
      </main>
    );
  } catch (error) {
    return (
      <Wrapper>
        <p className="text-red-500">{error.message}</p>
      </Wrapper>
    );
  }
}
