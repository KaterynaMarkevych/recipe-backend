import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Not authenticated" });

  const { id } = req.query;
  const { value } = req.body;

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: "Invalid rating value" });
  }

  const recipe = await Recipe.findById(id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  const userId = session.user.id;

  const numericValue = Number(value);
  if (isNaN(numericValue) || numericValue < 1 || numericValue > 5) {
    return res.status(400).json({ message: "Invalid rating value" });
  }

  const existing = recipe.ratings.find((r) => r.user.toString() === userId);

  if (existing) {
    existing.value = numericValue; // update existing rating
  } else {
    recipe.ratings.push({ user: userId, value: numericValue }); // add new rating
  }
  recipe.markModified("ratings");

  // Recalculate average rating
  if (recipe.ratings.length > 0) {
    const validRatings = recipe.ratings.filter(
      (r) => typeof r.value === "number"
    );
    const sum = validRatings.reduce((acc, r) => acc + r.value, 0);
    const avg = sum / validRatings.length;
    recipe.rating = isNaN(avg) ? 0 : Math.round(avg * 100) / 100;
  } else {
    recipe.rating = 0;
  }

  try {
    await recipe.save();
    return res.status(200).json({ rating: recipe.rating });
  } catch (err) {
    console.error("Помилка при збереженні рецепту:", err);
    return res
      .status(500)
      .json({ message: "Failed to save recipe", error: err.message });
  }
}
