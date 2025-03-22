import { Suspense } from 'react';
import { connectToDatabase } from '../../../lib/mongodb';
import Recipe from '../../../models/Recipe';
import mongoose from 'mongoose';
import dynamic from 'next/dynamic';

// Dynamically import the RecipeDetail component with server-side rendering enabled
const RecipeDetail = dynamic(() => import('../../../components/Recipes/RecipeDetail'), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export const metadata = {
  title: 'Рецепт | Кулінарні шедеври',
  description: 'Детальна інформація про рецепт, інгредієнти та спосіб приготування.',
};

// Use getRecipeData for server-side data fetching
async function getRecipeData(id) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { error: 'Некоректний ID рецепту' };
    }
    
    // Find the recipe by ID
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return { error: 'Рецепт не знайдено' };
    }
    
    // Convert Mongoose document to plain object
    return { recipe: JSON.parse(JSON.stringify(recipe)) };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return { error: 'Помилка при отриманні рецепту' };
  }
}

export default async function RecipePage({ params }) {
  const { id } = params;
  const { recipe, error } = await getRecipeData(id);
  
  return (
    <main>
      <RecipeDetail id={id} initialData={{ recipe, error }} />
    </main>
  );
} 