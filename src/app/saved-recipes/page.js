import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import SavedRecipesList from "@/components/Recipes/SavedRecipesList";
import Wrapper from "@/components/shared/Wrapper/Wrapper";

export default async function SavedRecipesPage() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl">
          Щоб переглянути збережені рецепти, увійдіть у свій обліковий запис.
        </h2>
      </div>
    );
  }

  const user = await User.findOne({ email: session.user.email })
    .populate({
      path: "savedRecipes",
      select:
        "title description image rating servings cookingTime difficulty diet type",
    })
    .lean();

  if (user && user.savedRecipes) {
    user.savedRecipes = user.savedRecipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
    }));
  }

  return (
    <main>
      <Wrapper>
        <SavedRecipesList recipes={user.savedRecipes} />
      </Wrapper>
    </main>
  );
}
