import { connectToDatabase } from "../../lib/mongodb";
import Recipe from "../../models/Recipe";

export default async function handler(req, res) {
  try {
    await connectToDatabase(); // підключення до БД
    const recipes = await Recipe.find({}); // отримання всіх рецептів
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні рецептів", error });
  }
}
