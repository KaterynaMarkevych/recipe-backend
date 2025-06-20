import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import mongoose from "mongoose";

export async function getRecipeById(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid recipe ID");
  }

  await connectToDatabase();

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  if (recipe.author.toString() !== userId) {
    throw new Error("No access to this recipe");
  }

  return recipe;
}
