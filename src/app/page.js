import { connectToDatabase } from "../lib/mongodb";
import Recipe from "../models/Recipe";
import HeroSection from "../components/HomePage/HeroSection/HeroSection";
import AboutUs from "@/components/HomePage/AboutUsSection/AboutUs";
import PopularRecipeSection from "@/components/HomePage/PopularRecipeSection/PopularRecipeSection";

// Fetch popular recipes server-side
async function getPopularRecipes() {
  try {
    await connectToDatabase();
    
    // Find top rated recipes
    const recipes = await Recipe.find()
      .sort({ rating: -1 })
      .limit(4)
      .lean();
    
    return { 
      recipes: JSON.parse(JSON.stringify(recipes)),
      error: null
    };
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    return { 
      recipes: [],
      error: 'Помилка при отриманні рецептів'
    };
  }
}

export default async function Home() {
  const popularRecipesData = await getPopularRecipes();

  return (
    <>
      <HeroSection />
      <AboutUs />
      <PopularRecipeSection initialData={popularRecipesData} />
    </>
  );
}
