import { connectToDatabase } from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import dynamic from "next/dynamic";

// Dynamically import the Recipes component with server-side rendering enabled
const Recipes = dynamic(() => import("../../components/Recipes/Recipes"), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export const metadata = {
  title: "Рецепти | Кулінарні шедеври",
  description: "Пошук рецептів за параметрами та інгредієнтами.",
};

// Function to get initial recipes data from the server
async function getInitialRecipesData() {
  try {
    await connectToDatabase();

    // Initially fetch recipes without filters
    const recipes = await Recipe.find({ is_published: true })
      .sort({ rating: -1 })
      .limit(6)
      .lean();

    return {
      recipes: JSON.parse(JSON.stringify(recipes)),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching initial recipes:", error);
    return {
      recipes: [],
      error: "Помилка при отриманні рецептів",
    };
  }
}

export default async function RecipesPage() {
  const initialData = await getInitialRecipesData();

  return (
    <main>
      <Recipes initialData={initialData} />
    </main>
  );
}
