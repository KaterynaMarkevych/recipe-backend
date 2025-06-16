import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.query;

  await connectToDatabase();

  const recipe = await Recipe.findById(id).populate(
    "comments.user",
    "username avatar"
  );

  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  res.status(200).json({ comments: recipe.comments });
}
